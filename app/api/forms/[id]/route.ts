import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 503 })

    const { id } = await params
    const body = await request.json()
    const userId = (user as { _id: ObjectId })._id.toString()

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (body.title !== undefined) update.title = body.title
    if (body.description !== undefined) update.description = body.description
    if (body.fields !== undefined) update.fields = body.fields

    const result = await db.collection("forms").updateOne(
      { _id: new ObjectId(id), userId },
      { $set: update }
    )

    if (result.matchedCount === 0) return NextResponse.json({ error: "Form not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 503 })

    const { id } = await params
    const userId = (user as { _id: ObjectId })._id.toString()

    await db.collection("forms").deleteOne({ _id: new ObjectId(id), userId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
