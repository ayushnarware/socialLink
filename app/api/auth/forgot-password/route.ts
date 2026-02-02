import { NextRequest, NextResponse } from "next/server"

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

    // In demo mode, generate a mock reset token
    // In production, you would:
    // 1. Find user by email
    // 2. Generate a secure reset token
    // 3. Save it to database with expiry (24 hours)
    // 4. Send email with reset link: /reset-password?token=<token>

    const mockToken = Buffer.from(email + Date.now()).toString("base64")
    
    // In production, send email here
    console.log(`[DEMO] Password reset link: /reset-password?token=${mockToken}`)

    return NextResponse.json({
      success: true,
      message: "Password reset email sent (demo mode)",
      demo: true,
      // In production, don't return the token - send it via email only
      token: process.env.NODE_ENV === "development" ? mockToken : undefined,
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
