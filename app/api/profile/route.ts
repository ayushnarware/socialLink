import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later."  },
        { status: 503 }
      )
    }

    const body = await request.json()
    const userId = (user as { _id: ObjectId })._id

    if (body.username !== undefined) {
      const newUsername = body.username.toLowerCase().trim()
      if (newUsername.length < 2) {
        return NextResponse.json({ error: "Username must be at least 2 characters" }, { status: 400 })
      }
      const existing = await db.collection("users").findOne({ username: newUsername })
      if (existing && String(existing._id) !== String(userId)) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 409 })
      }
    }

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (body.name !== undefined) update.name = body.name
    if (body.username !== undefined) update.username = body.username.toLowerCase().trim()
    if (body.bio !== undefined) update.bio = body.bio
    if (body.avatar !== undefined) update.avatar = body.avatar
    if (body.websiteUrl !== undefined) update.websiteUrl = body.websiteUrl
    if (body.socials !== undefined) update.socials = body.socials

    await db.collection("users").updateOne({ _id: userId }, { $set: update })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
