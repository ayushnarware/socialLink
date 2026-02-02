import { NextResponse } from "next/server"
import { isMongoDBConfigured, getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"

// Demo analytics data
const demoAnalytics = {
  totalViews: 12847,
  totalClicks: 4521,
  uniqueVisitors: 8934,
  avgTimeOnPage: 45,
  viewsChange: 12.5,
  clicksChange: 8.3,
  visitorsChange: -2.1,
  timeChange: 5.7,
  topLinks: [
    { title: "My Portfolio", clicks: 1234, percentage: 27.3 },
    { title: "YouTube Channel", clicks: 987, percentage: 21.8 },
    { title: "Latest Video", clicks: 756, percentage: 16.7 },
    { title: "Shop My Merch", clicks: 543, percentage: 12.0 },
    { title: "Twitter Profile", clicks: 421, percentage: 9.3 },
  ],
  deviceStats: [
    { device: "Mobile", percentage: 68 },
    { device: "Desktop", percentage: 28 },
    { device: "Tablet", percentage: 4 },
  ],
  locationStats: [
    { country: "United States", percentage: 35 },
    { country: "India", percentage: 22 },
    { country: "United Kingdom", percentage: 12 },
    { country: "Canada", percentage: 8 },
    { country: "Germany", percentage: 6 },
  ],
  referrerStats: [
    { source: "Instagram", percentage: 42 },
    { source: "Twitter/X", percentage: 28 },
    { source: "TikTok", percentage: 15 },
    { source: "Direct", percentage: 10 },
    { source: "Other", percentage: 5 },
  ],
  chartData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    views: Math.floor(Math.random() * 500) + 200,
    clicks: Math.floor(Math.random() * 200) + 50,
  })),
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isMongoDBConfigured()) {
      return NextResponse.json({
        analytics: demoAnalytics,
        demo: true,
      })
    }

    const db = await getDatabase()
    
    // Get analytics from database
    const analyticsCollection = db.collection("analytics")
    const linksCollection = db.collection("links")
    
    // Get user's links
    const userLinks = await linksCollection
      .find({ userId: user.userId })
      .toArray()

    // Calculate total clicks
    const totalClicks = userLinks.reduce((sum, link) => sum + (link.clicks || 0), 0)

    // Get page views (you would track this separately)
    const pageViews = await analyticsCollection
      .find({ userId: user.userId, type: "pageView" })
      .toArray()

    // For now, return demo data with real link clicks
    return NextResponse.json({
      analytics: {
        ...demoAnalytics,
        totalClicks,
        topLinks: userLinks
          .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
          .slice(0, 5)
          .map((link) => ({
            title: link.title,
            clicks: link.clicks || 0,
            percentage: totalClicks > 0 ? Math.round((link.clicks || 0) / totalClicks * 100 * 10) / 10 : 0,
          })),
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
