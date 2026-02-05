import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json()

    if (!linkId) {
      return NextResponse.json(
        { error: "Link ID required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 503 }
      )
    }

    const result = await db.collection("links").updateOne(
      { _id: new ObjectId(linkId) },
      { $inc: { clicks: 1 }, $set: { updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track click error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
