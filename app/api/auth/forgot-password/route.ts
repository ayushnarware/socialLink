import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
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

    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await db.collection("passwordResetTokens").updateOne(
      { email },
      { $set: { token: resetToken, expiresAt } },
      { upsert: true }
    )

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`

    console.log(`Password reset link for ${email}: ${resetLink}`)

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
