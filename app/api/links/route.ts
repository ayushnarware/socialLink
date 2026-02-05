import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
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

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const links = await db
      .collection<Link>("links")
      .find({ userId })
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json({
      links: links.map((link: Link & { videoUrl?: string; musicUrl?: string; images?: string[]; cryptoAddress?: string; cryptoType?: string }) => ({
        id: link._id!.toString(),
        title: link.title,
        url: link.url,
        type: link.type,
        visible: link.visible,
        spotlight: link.spotlight,
        order: link.order,
        clicks: link.clicks,
        videoUrl: link.videoUrl,
        musicUrl: link.musicUrl,
        images: link.images,
        cryptoAddress: link.cryptoAddress,
        cryptoType: link.cryptoType,
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

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get("linkId")
    if (!linkId) {
      return NextResponse.json({ error: "Link ID required" }, { status: 400 })
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const result = await db.collection<Link>("links").deleteOne({
      _id: new ObjectId(linkId),
      userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete link error:", error)
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

    const body = await request.json()
    const { title, url, type = "link", videoUrl, musicUrl, images, cryptoAddress, cryptoType } = body

    const linkUrl = type === "video" ? videoUrl : type === "music" ? musicUrl : type === "crypto" ? (cryptoAddress || "#") : url
    if (!title || (!linkUrl && type !== "gallery")) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const lastLink = await db
      .collection<Link>("links")
      .findOne({ userId }, { sort: { order: -1 } })
    
    const order = lastLink ? lastLink.order + 1 : 0
    const now = new Date()

    const newLink: Link & { videoUrl?: string; musicUrl?: string; images?: string[]; cryptoAddress?: string; cryptoType?: string } = {
      userId,
      title,
      url: linkUrl || (Array.isArray(images) && images[0] ? images[0] : "#"),
      type,
      visible: true,
      spotlight: false,
      order,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    }
    if (videoUrl) newLink.videoUrl = videoUrl
    if (musicUrl) newLink.musicUrl = musicUrl
    if (images?.length) newLink.images = Array.isArray(images) ? images : []
    if (cryptoAddress) newLink.cryptoAddress = cryptoAddress
    if (cryptoType) newLink.cryptoType = cryptoType

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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      )
    }

    const { linkId, ...updates } = await request.json()
    if (!linkId) {
      return NextResponse.json({ error: "Link ID required" }, { status: 400 })
    }

    const userId = (user as { _id: ObjectId })._id.toString()
    const updateFields: Record<string, unknown> = { updatedAt: new Date() }
    if (updates.title !== undefined) updateFields.title = updates.title
    if (updates.url !== undefined) updateFields.url = updates.url
    if (updates.type !== undefined) updateFields.type = updates.type
    if (updates.visible !== undefined) updateFields.visible = updates.visible
    if (updates.spotlight !== undefined) updateFields.spotlight = updates.spotlight
    if (updates.order !== undefined) updateFields.order = updates.order
    if (updates.videoUrl !== undefined) updateFields.videoUrl = updates.videoUrl
    if (updates.musicUrl !== undefined) updateFields.musicUrl = updates.musicUrl
    if (updates.images !== undefined) updateFields.images = updates.images
    if (updates.cryptoAddress !== undefined) updateFields.cryptoAddress = updates.cryptoAddress
    if (updates.cryptoType !== undefined) updateFields.cryptoType = updates.cryptoType

    const result = await db.collection<Link>("links").updateOne(
      { _id: new ObjectId(linkId), userId },
      { $set: updateFields }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update link error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
