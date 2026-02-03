// OAuth Configuration for Google and Facebook
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
export const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/auth/google/callback`

export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || ""
export const FACEBOOK_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/auth/facebook/callback`

// OAuth URLs
export const getGoogleOAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export const getFacebookOAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    scope: "public_profile,email",
    response_type: "code",
  })
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
}

export interface OAuthProfile {
  id: string
  email: string
  name: string
  avatar?: string
  provider: "google" | "facebook"
}
