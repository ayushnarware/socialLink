import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const linksCollection = db.collection("links")
    const analyticsCollection = db.collection("analytics")

    const userLinks = await linksCollection
      .find({ userId })
      .toArray()

    const totalClicks = userLinks.reduce((sum: number, link: { clicks?: number }) => sum + (link.clicks || 0), 0)
    const analyticsEvents = await analyticsCollection.find({ userId }).toArray()

    const pageViews = analyticsEvents.filter((e: { type?: string }) => e.type === "pageView")
    const totalViews = pageViews.length

    const deviceCounts: Record<string, number> = {}
    analyticsEvents.forEach((e: { device?: string }) => {
      const d = e.device || "Unknown"
      deviceCounts[d] = (deviceCounts[d] || 0) + 1
    })
    const deviceTotal = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1
    const deviceStats = Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      percentage: Math.round((count / deviceTotal) * 100),
    }))

    const referrerCounts: Record<string, number> = {}
    analyticsEvents.forEach((e: { referrer?: string }) => {
      const r = e.referrer || "Direct"
      referrerCounts[r] = (referrerCounts[r] || 0) + 1
    })
    const referrerTotal = Object.values(referrerCounts).reduce((a, b) => a + b, 0) || 1
    const referrerStats = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, percentage: Math.round((count / referrerTotal) * 100) }))

    const topLinks = userLinks
      .sort((a: { clicks?: number }, b: { clicks?: number }) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
      .map((link: { title: string; clicks?: number }) => ({
        title: link.title,
        clicks: link.clicks || 0,
        percentage: totalClicks > 0 ? Math.round((link.clicks || 0) / totalClicks * 100 * 10) / 10 : 0,
      }))

    const filesCollection = db.collection("files")
    const formsCollection = db.collection("forms")
    const userFiles = await filesCollection.find({ userId }).toArray()
    const userForms = await formsCollection.find({ userId }).toArray()
    const formViewEvents = analyticsEvents.filter((e: { type?: string; formId?: string }) => e.type === "formView" && e.formId)

    const fileViews = userFiles.map((f: { _id: ObjectId; name: string; views?: number }) => ({
      id: f._id.toString(),
      name: f.name,
      views: f.views || 0,
    }))
    const formViews = userForms.map((f: { _id: ObjectId; title: string }) => {
      const views = formViewEvents.filter((e: { formId?: string }) => e.formId === f._id.toString()).length
      return { id: f._id.toString(), title: f.title, views }
    })

    return NextResponse.json({
      analytics: {
        totalViews,
        totalClicks,
        uniqueVisitors: totalViews,
        avgTimeOnPage: 0,
        viewsChange: 0,
        clicksChange: 0,
        visitorsChange: 0,
        timeChange: 0,
        topLinks,
        links: userLinks.map((l: { _id: ObjectId; title: string; clicks?: number; visible?: boolean }) => ({
          id: l._id.toString(),
          title: l.title,
          clicks: l.clicks || 0,
          visible: l.visible !== false,
        })),
        deviceStats,
        locationStats: [],
        referrerStats,
        chartData: [],
        fileViews,
        formViews,
      },
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
