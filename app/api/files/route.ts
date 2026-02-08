import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Internal Database Server Error. Please try again later."  }, { status: 503 })

    const userId = (user as { _id: ObjectId })._id.toString()
    const files = await db.collection("files").find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      files: files.map((f: { _id: ObjectId; name: string; type: string; content: string; mimeType?: string; size?: number; views: number; createdAt: Date }) => ({
        id: f._id.toString(),
        name: f.name,
        type: f.type,
        content: f.content,
        mimeType: f.mimeType,
        size: f.size,
        views: f.views || 0,
        createdAt: f.createdAt?.toISOString?.() || new Date().toISOString(),
      })),
    })
  } catch (error) {
    console.error("Get files error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Internal Database Server Error. Please try again later."  }, { status: 503 })

    const { name, type, content, mimeType, size } = await request.json()
    if (!name || !type || content === undefined) {
      return NextResponse.json({ error: "name, type, content required" }, { status: 400 })
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const doc = { userId, name, type, content, mimeType: mimeType || null, size: size || null, views: 0, createdAt: new Date() }
    const result = await db.collection("files").insertOne(doc)

    return NextResponse.json({
      success: true,
      file: { id: result.insertedId.toString(), ...doc, views: 0 },
    })
  } catch (error) {
    console.error("Create file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 503 })

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    if (!fileId) return NextResponse.json({ error: "fileId required" }, { status: 400 })

    const userId = (user as { _id: ObjectId })._id.toString()
    await db.collection("files").deleteOne({ _id: new ObjectId(fileId), userId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
