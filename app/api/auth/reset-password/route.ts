import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
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

    const resetDoc = await db.collection("passwordResetTokens").findOne({ token })
    if (!resetDoc || !resetDoc.expiresAt || new Date() > resetDoc.expiresAt) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.collection("users").updateOne(
      { email: resetDoc.email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )
    await db.collection("passwordResetTokens").deleteOne({ token })

    return NextResponse.json({
      success: true,
      message: "Password reset successful.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
