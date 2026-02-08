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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (user as { role?: string }).role
    if (role !== "admin" && role !== "super-admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected." },
        { status: 503 }
      )
    }

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (body.status !== undefined) update.status = body.status
    if (body.role !== undefined) update.role = body.role
    if (body.plan !== undefined) update.plan = body.plan

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin update user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (user as { role?: string }).role
    if (role !== "admin" && role !== "super-admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later."  },
        { status: 503 }
      )
    }

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin delete user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
