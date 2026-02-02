import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Demo mode - always return auth error to redirect to login
    return NextResponse.json(
      { error: "Not authenticated", demo: true },
      { status: 401 }
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
