import { NextRequest, NextResponse } from "next/server"
import { isMongoDBConfigured, getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export interface Link {
  _id?: ObjectId
  userId: string
  title: string
  url: string
  type: "link" | "button" | "video" | "music" | "gallery" | "social"
  visible: boolean
  spotlight?: boolean
  order: number
  clicks: number
  createdAt: Date
  updatedAt: Date
}

// Demo links for when MongoDB is not configured
const demoLinks: Omit<Link, "_id" | "userId">[] = [
  {
    title: "My Portfolio",
    url: "https://portfolio.example.com",
    type: "link",
    visible: true,
    spotlight: true,
    order: 0,
    clicks: 234,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Follow me on YouTube",
    url: "https://youtube.com/@example",
    type: "link",
    visible: true,
    order: 1,
    clicks: 156,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Latest Video",
    url: "https://youtube.com/watch?v=abc123",
    type: "video",
    visible: true,
    order: 2,
    clicks: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isMongoDBConfigured()) {
      return NextResponse.json({
        links: demoLinks.map((link, index) => ({
          ...link,
          id: `demo-${index}`,
        })),
        demo: true,
      })
    }

    const db = await getDatabase()
    const links = await db
      .collection<Link>("links")
      .find({ userId: user.userId })
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json({
      links: links.map((link) => ({
        id: link._id!.toString(),
        title: link.title,
        url: link.url,
        type: link.type,
        visible: link.visible,
        spotlight: link.spotlight,
        order: link.order,
        clicks: link.clicks,
      })),
    })
  } catch (error) {
    console.error("Get links error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, url, type = "link" } = await request.json()

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      )
    }

    if (!isMongoDBConfigured()) {
      return NextResponse.json({
        link: {
          id: `demo-${Date.now()}`,
          title,
          url,
          type,
          visible: true,
          spotlight: false,
          order: 0,
          clicks: 0,
        },
        demo: true,
      })
    }

    const db = await getDatabase()
    
    // Get the highest order number
    const lastLink = await db
      .collection<Link>("links")
      .findOne({ userId: user.userId }, { sort: { order: -1 } })
    
    const order = lastLink ? lastLink.order + 1 : 0
    const now = new Date()

    const newLink: Link = {
      userId: user.userId,
      title,
      url,
      type,
      visible: true,
      spotlight: false,
      order,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<Link>("links").insertOne(newLink)

    return NextResponse.json({
      link: {
        id: result.insertedId.toString(),
        ...newLink,
      },
    })
  } catch (error) {
    console.error("Create link error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
