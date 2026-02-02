import { NextRequest, NextResponse } from "next/server"

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

    // In demo mode, always succeed
    // In production, you would:
    // 1. Verify token is valid and not expired
    // 2. Find user associated with token
    // 3. Hash new password with bcrypt
    // 4. Update user's password in database
    // 5. Delete/invalidate the reset token
    // 6. Send confirmation email (optional)

    return NextResponse.json({
      success: true,
      message: "Password reset successful (demo mode)",
      demo: true,
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
