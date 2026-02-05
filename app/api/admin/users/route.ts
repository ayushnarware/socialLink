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

    const role = (user as { role?: string }).role
    if (role !== "admin" && role !== "super-admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const users = await db
      .collection("users")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray()

    const linksCollection = db.collection("links")
    const linkCounts = await linksCollection
      .aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 }, clicks: { $sum: "$clicks" } } },
      ])
      .toArray()

    const linkMap = Object.fromEntries(
      linkCounts.map((r: { _id: string; count: number; clicks: number }) => [
        r._id,
        { links: r.count, views: r.clicks },
      ])
    )

    return NextResponse.json({
      users: users.map(
        (u: {
          _id: ObjectId
          name: string
          email: string
          plan?: string
          role?: string
          status?: string
          createdAt?: Date
        }) => {
          const id = u._id.toString()
          const stats = linkMap[id] || { links: 0, views: 0 }
          return {
            id,
            name: u.name || "—",
            email: u.email,
            plan: u.plan || "free",
            role: u.role || "user",
            status: u.status || "active",
            links: stats.links,
            views: stats.views,
            joined: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—",
          }
        }
      ),
    })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
