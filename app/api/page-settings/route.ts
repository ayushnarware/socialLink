import { NextRequest, NextResponse } from "next/server"
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
    const settings = await db.collection("pageSettings").findOne({ userId })

    return NextResponse.json({
      themeId: settings?.theme || "default",
      customColors: settings?.customColors || { background: "", accent: "" },
      seoTitle: settings?.seoTitle || "",
      seoDescription: settings?.seoDescription || "",
      seoKeywords: settings?.seoKeywords || "",
      ogImage: settings?.ogImage || "",
      canonicalUrl: settings?.canonicalUrl || "",
    })
  } catch (error) {
    console.error("Get page settings error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const userId = (user as { _id: ObjectId })._id.toString()
    const update: Record<string, unknown> = { userId, updatedAt: new Date() }
    if (body.themeId !== undefined || body.theme !== undefined) update.theme = body.themeId || body.theme || "default"
    if (body.customColors !== undefined) update.customColors = body.customColors || {}
    if (body.seoTitle !== undefined) update.seoTitle = body.seoTitle
    if (body.seoDescription !== undefined) update.seoDescription = body.seoDescription
    if (body.seoKeywords !== undefined) update.seoKeywords = body.seoKeywords
    if (body.ogImage !== undefined) update.ogImage = body.ogImage
    if (body.canonicalUrl !== undefined) update.canonicalUrl = body.canonicalUrl

    await db.collection("pageSettings").updateOne(
      { userId },
      { $set: update },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update page settings error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
