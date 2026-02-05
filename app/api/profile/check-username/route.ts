import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")?.toLowerCase()?.trim()

    if (!username || username.length < 2) {
      return NextResponse.json({ available: false, error: "Username too short" })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json({ available: false, error: "Database not connected" })
    }

    const user = await getCurrentUser()
    const existing = await db.collection("users").findOne({ username })

    if (!existing) {
      return NextResponse.json({ available: true })
    }

    const currentUserId = user ? String((user as { _id: ObjectId })._id) : null
    if (currentUserId && String(existing._id) === currentUserId) {
      return NextResponse.json({ available: true })
    }

    return NextResponse.json({ available: false })
  } catch (error) {
    console.error("Check username error:", error)
    return NextResponse.json({ available: false })
  }
}
