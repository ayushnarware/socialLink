import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    // Handle OAuth errors
    if (error) {
      console.error("[Facebook OAuth Error]", error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=missing_code", request.url)
      )
    }

    return NextResponse.redirect(
      new URL("/login?error=oauth_not_configured", request.url)
    )
  } catch (error) {
    console.error("[Facebook OAuth Callback Error]", error)
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url)
    )
  }
}
