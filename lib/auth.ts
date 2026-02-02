// Demo-only authentication utility
export interface JWTPayload {
  userId: string
  email: string
  role: "user" | "admin"
  plan: "free" | "pro" | "business"
}

export interface User {
  _id?: string
  email: string
  password?: string
  name: string
  role: "user" | "admin"
  plan: "free" | "pro" | "business"
  planExpiry?: Date
  createdAt?: Date
  updatedAt?: Date
  avatar?: string
  username?: string
  bio?: string
}

export async function hashPassword(password: string): Promise<string> {
  return password
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return password === hashedPassword
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    return JSON.parse(decoded) as JWTPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string): Promise<void> {}

export async function removeAuthCookie(): Promise<void> {}

export async function getAuthToken(): Promise<string | null> {
  return null
}

export async function getCurrentUser() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ayush_demo_auth")
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "admin") {
    throw new Error("Forbidden")
  }
  return user
}

export function canAccessFeature(
  user: User,
  feature: "unlimited_links" | "custom_domain" | "api_access" | "remove_branding" | "advanced_analytics"
): boolean {
  const planFeatures = {
    free: [],
    pro: ["unlimited_links", "remove_branding", "advanced_analytics"],
    business: ["unlimited_links", "custom_domain", "api_access", "remove_branding", "advanced_analytics"],
  }

  return planFeatures[user.plan].includes(feature)
}

export function isPlanExpired(user: User): boolean {
  if (user.plan === "free") return false
  if (!user.planExpiry) return true
  return new Date() > new Date(user.planExpiry)
}
