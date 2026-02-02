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

    // In demo mode, create a demo user
    // In production, exchange code for token and fetch user info from Facebook
    const demoUser = {
      id: `facebook-${Date.now()}`,
      email: `user-${Date.now()}@facebook.com`,
      name: "Facebook User",
      avatar: undefined,
      provider: "facebook",
    }

    // Store demo user in localStorage via redirect with user data
    const userData = encodeURIComponent(JSON.stringify(demoUser))
    return NextResponse.redirect(
      new URL(`/auth/oauth-callback?provider=facebook&user=${userData}`, request.url)
    )
  } catch (error) {
    console.error("[Facebook OAuth Callback Error]", error)
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url)
    )
  }
}
