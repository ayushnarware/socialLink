import { NextRequest, NextResponse } from "next/server"
import { isMongoDBConfigured, getDatabase, User } from "@/lib/mongodb"

// Demo profile data
const demoProfile = {
  username: "demo",
  name: "Demo User",
  bio: "Content Creator | Developer | Designer | Building cool stuff on the internet",
  avatar: null,
  theme: "dark",
  links: [
    {
      id: "1",
      title: "My Portfolio",
      url: "https://portfolio.example.com",
      type: "link",
      visible: true,
      spotlight: true,
    },
    {
      id: "2",
      title: "Follow me on YouTube",
      url: "https://youtube.com/@example",
      type: "link",
      visible: true,
    },
    {
      id: "3",
      title: "Latest Video - How to Build a SaaS",
      url: "https://youtube.com/watch?v=abc123",
      type: "video",
      visible: true,
    },
    {
      id: "4",
      title: "My Music on Spotify",
      url: "https://open.spotify.com",
      type: "music",
      visible: true,
    },
    {
      id: "5",
      title: "Shop My Merch",
      url: "https://shop.example.com",
      type: "link",
      visible: true,
    },
  ],
  socials: [
    { platform: "twitter", url: "https://twitter.com/example" },
    { platform: "instagram", url: "https://instagram.com/example" },
    { platform: "youtube", url: "https://youtube.com/@example" },
  ],
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    if (!isMongoDBConfigured()) {
      // Return demo profile with customized username
      return NextResponse.json({
        profile: {
          ...demoProfile,
          username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
        },
        demo: true,
      })
    }

    const db = await getDatabase()

    // Find user by username
    const user = await db
      .collection<User>("users")
      .findOne({ username: username.toLowerCase() })

    if (!user) {
      // Return demo profile for non-existent users
      return NextResponse.json({
        profile: {
          ...demoProfile,
          username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
        },
        demo: true,
      })
    }

    // Get user's links
    const links = await db
      .collection("links")
      .find({ userId: user._id!.toString(), visible: true })
      .sort({ order: 1 })
      .toArray()

    // Get page settings
    const pageSettings = await db
      .collection("pageSettings")
      .findOne({ userId: user._id!.toString() })

    return NextResponse.json({
      profile: {
        username: user.username,
        name: user.name,
        bio: user.bio || "",
        avatar: user.avatar || null,
        theme: pageSettings?.theme || "default",
        links: links.map((link) => ({
          id: link._id!.toString(),
          title: link.title,
          url: link.url,
          type: link.type,
          visible: link.visible,
          spotlight: link.spotlight,
        })),
        socials: user.socials || [],
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
