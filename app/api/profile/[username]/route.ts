import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json(
        { error: "Internal Database Server Error. Please try again later." },
        { status: 503 }
      )
    }

    const user = await db
      .collection("users")
      .findOne({ username: username.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Get user's links
    const links = await db
      .collection("links")
      .find({ userId: user._id!.toString(), visible: true })
      .sort({ order: 1 })
      .toArray()

    const pageSettings = await db
      .collection("pageSettings")
      .findOne({ userId: user._id!.toString() })

    const files = await db
      .collection("files")
      .find({ userId: user._id!.toString() })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    const forms = await db
      .collection("forms")
      .find({ userId: user._id!.toString() })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    const seo = pageSettings
      ? {
          title: pageSettings.seoTitle || "",
          description: pageSettings.seoDescription || "",
          keywords: pageSettings.seoKeywords || "",
          ogImage: pageSettings.ogImage || "",
          canonicalUrl: pageSettings.canonicalUrl || "",
        }
      : {}

    return NextResponse.json({
      profile: {
        username: user.username || user.name?.toLowerCase().replace(/\s+/g, "") || "user",
        name: user.name,
        bio: user.bio || "",
        avatar: user.avatar || null,
        websiteUrl: user.websiteUrl || "",
        plan: user.plan || "free",
        theme: pageSettings?.theme || "default",
        links: links.map((link: { _id: { toString: () => string }; title: string; url: string; type: string; visible: boolean; spotlight?: boolean; clicks?: number; videoUrl?: string; musicUrl?: string; images?: string[]; cryptoAddress?: string; cryptoType?: string }) => ({
          id: link._id.toString(),
          title: link.title,
          url: link.url,
          type: link.type,
          visible: link.visible,
          spotlight: link.spotlight,
          clicks: link.clicks || 0,
          videoUrl: link.videoUrl,
          musicUrl: link.musicUrl,
          images: link.images,
          cryptoAddress: link.cryptoAddress,
          cryptoType: link.cryptoType,
        })),
        socials: user.socials || [],
        files: files.map((f: { _id: { toString: () => string }; name: string; type: string; content?: string; size?: number; views?: number }) => ({
          id: f._id.toString(),
          name: f.name,
          type: f.type,
          content: f.type === "image" ? f.content : undefined,
          size: f.size,
          views: f.views || 0,
        })),
        forms: forms.map((f: { _id: { toString: () => string }; title: string }) => ({
          id: f._id.toString(),
          title: f.title,
        })),
        seo,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
