import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const fileId = searchParams.get("fileId")

    if (!username || !fileId) {
      return NextResponse.json({ error: "username and fileId required" }, { status: 400 })
    }

    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 503 })

    const user = await db.collection("users").findOne({ username: username.toLowerCase() })
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const userId = user._id.toString()
    const file = await db.collection("files").findOne({ _id: new ObjectId(fileId), userId })
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 })

    await db.collection("files").updateOne(
      { _id: new ObjectId(fileId) },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({
      file: {
        id: file._id.toString(),
        name: file.name,
        type: file.type,
        content: file.content,
        mimeType: file.mimeType,
        size: file.size,
        views: (file.views || 0) + 1,
      },
    })
  } catch (error) {
    console.error("Get shared file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
