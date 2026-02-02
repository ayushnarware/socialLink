"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState, useEffect } from "react"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  plan: "free" | "pro" | "business"
  avatar?: string
  username?: string
  bio?: string
  createdAt: string
}

const DEMO_USER: AuthUser = {
  id: "demo-user-123",
  email: "demo@ayush.app",
  name: "Demo User",
  role: "user",
  plan: "pro",
  username: "demouser",
  bio: "This is a demo account",
  createdAt: new Date().toISOString(),
}

const DEMO_STORAGE_KEY = "ayush_demo_auth"

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(DEMO_STORAGE_KEY)
        if (stored) {
          try {
            const demoUser = JSON.parse(stored)
            setUser(demoUser)
            setIsDemo(true)
            setIsLoading(false)
            return
          } catch {
            localStorage.removeItem(DEMO_STORAGE_KEY)
          }
        }
      }

      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          setIsDemo(!!data.demo)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const responseData = await res.json()

      if (responseData.demo) {
        const demoUser = { ...DEMO_USER, email, name: email.split("@")[0] }
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
        setUser(demoUser)
        setIsDemo(true)
        router.push("/dashboard")
        return responseData
      }

      if (!res.ok) {
        throw new Error(responseData.error || "Login failed")
      }

      await fetchUser()
      router.push("/dashboard")
      return responseData
    },
    [fetchUser, router]
  )

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const responseData = await res.json()

      if (responseData.demo) {
        const demoUser = { ...DEMO_USER, email, name }
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
        setUser(demoUser)
        setIsDemo(true)
        router.push("/dashboard")
        return responseData
      }

      if (!res.ok) {
        throw new Error(responseData.error || "Signup failed")
      }

      await fetchUser()
      router.push("/dashboard")
      return responseData
    },
    [fetchUser, router]
  )

  const logout = useCallback(async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY)
    setUser(null)
    setIsDemo(false)
    
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }, [router])

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    login,
    signup,
    logout,
    mutate: fetchUser,
    isDemo,
  }
}
