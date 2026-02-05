import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params
    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 503 })

    const file = await db.collection("files").findOne({ _id: new ObjectId(fileId) })
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
    console.error("Get file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
