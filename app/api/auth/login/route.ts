import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Demo mode - always accept login
    return NextResponse.json({
      success: true,
      demo: true,
      message: "Running in demo mode. Connect MongoDB to your account for production features.",
      user: {
        id: "demo-user-" + Date.now(),
        email: email,
        name: email.split("@")[0],
        role: "user",
        plan: "pro",
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
