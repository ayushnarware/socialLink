import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

function parseUserAgent(ua: string): { device: string; isMobile: boolean } {
  if (!ua) return { device: "Unknown", isMobile: false }
  const u = ua.toLowerCase()
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(u)) {
    if (/ipad|tablet/i.test(u)) return { device: "Tablet", isMobile: true }
    return { device: "Mobile", isMobile: true }
  }
  return { device: "Desktop", isMobile: false }
}

function parseReferrer(referrer: string): string {
  if (!referrer) return "Direct"
  try {
    const url = new URL(referrer)
    const host = url.hostname.replace(/^www\./, "")
    if (host.includes("instagram")) return "Instagram"
    if (host.includes("twitter") || host.includes("x.com")) return "Twitter/X"
    if (host.includes("facebook")) return "Facebook"
    if (host.includes("linkedin")) return "LinkedIn"
    if (host.includes("youtube")) return "YouTube"
    if (host.includes("tiktok")) return "TikTok"
    if (host.includes("google")) return "Google"
    return host
  } catch {
    return "Direct"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: rawUserId, username, type, linkId, fileId, formId } = await request.json()

    if (!type) {
      return NextResponse.json({ error: "type required" }, { status: 400 })
    }

    const db = await getDatabase()
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 })
    }

    let userId = rawUserId
    if (!userId && username) {
      const user = await db.collection("users").findOne({ username: username.toLowerCase() })
      userId = user?._id?.toString()
    }
    if (!userId) {
      return NextResponse.json({ error: "userId or username required" }, { status: 400 })
    }

    const ua = request.headers.get("user-agent") || ""
    const referrer = request.headers.get("referer") || ""
    const { device } = parseUserAgent(ua)
    const source = parseReferrer(referrer)

    const event = {
      userId,
      type,
      linkId: linkId || null,
      fileId: fileId || null,
      formId: formId || null,
      device,
      referrer: source,
      timestamp: new Date(),
    }

    await db.collection("analytics").insertOne(event)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics track error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
