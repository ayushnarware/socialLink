"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const provider = searchParams.get("provider")
    const userStr = searchParams.get("user")

    if (provider && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        // Store in localStorage
        localStorage.setItem("ayush_demo_auth", JSON.stringify(user))
        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error("OAuth callback error:", error)
        router.push("/login?error=invalid_data")
      }
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
        <p className="mt-4 text-muted-foreground">Completing your sign in...</p>
      </div>
    </div>
  )
}
