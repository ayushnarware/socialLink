"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, Star, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

interface UserLink {
  id: string
  title: string
  url: string
  type: string
  visible: boolean
  spotlight?: boolean
  icon?: string
  clicks: number
}

interface UserProfile {
  username: string
  name: string
  bio: string
  avatar: string | null
}

interface UserDesign {
  theme: string
  backgroundColor: string
  buttonStyle: string
  fontFamily: string
}

export function LinkPreview() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [links, setLinks] = useState<UserLink[]>([])
  const [design, setDesign] = useState<UserDesign | null>(null)

  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"

  useEffect(() => {
    const loadData = () => {
      // Load profile
      const savedProfile = localStorage.getItem(`ayush_profile_${username}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      } else if (user) {
        setProfile({
          username: username,
          name: user.name || username,
          bio: user.bio || "",
          avatar: user.avatar || null,
        })
      }

      // Load links
      const savedLinks = localStorage.getItem(`ayush_links_${username}`)
      if (savedLinks) {
        setLinks(JSON.parse(savedLinks))
      }

      // Load design
      const savedDesign = localStorage.getItem(`ayush_design_${username}`)
      if (savedDesign) {
        setDesign(JSON.parse(savedDesign))
      }
    }

    loadData()

    // Listen for storage changes
    const handleStorage = () => loadData()
    window.addEventListener("storage", handleStorage)
    
    // Also poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(loadData, 1000)
    
    return () => {
      window.removeEventListener("storage", handleStorage)
      clearInterval(interval)
    }
  }, [username, user])

  const displayName = profile?.name || user?.name || username
  const displayBio = profile?.bio || user?.bio || ""
  const displayAvatar = profile?.avatar || user?.avatar || null
  const bgColor = design?.backgroundColor || "#0a0a0a"
  const buttonStyle = design?.buttonStyle || "rounded"

  const getButtonRadius = () => {
    switch (buttonStyle) {
      case "pill": return "rounded-full"
      case "square": return "rounded-lg"
      default: return "rounded-xl"
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Preview</CardTitle>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
          <Button
            variant={viewMode === "mobile" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("mobile")}
            aria-label="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "desktop" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("desktop")}
            aria-label="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <div
          className={`relative overflow-hidden rounded-3xl border-4 border-foreground/20 transition-all ${
            viewMode === "mobile" ? "h-[600px] w-[300px]" : "h-[500px] w-full"
          }`}
          style={{ background: `linear-gradient(to bottom, ${bgColor}, ${bgColor}dd)` }}
        >
          {/* Phone notch */}
          {viewMode === "mobile" && (
            <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground/20" />
          )}

          {/* Content */}
          <div className="flex h-full flex-col items-center overflow-y-auto px-4 pt-12 pb-8">
            {/* Avatar */}
            {displayAvatar ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={displayAvatar || "/placeholder.svg"}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name */}
            <h3 className="mt-4 text-lg font-bold text-white">@{username}</h3>
            {displayBio && (
              <p className="mt-1 text-center text-sm text-white/60 max-w-[200px]">
                {displayBio}
              </p>
            )}

            {/* Links */}
            <div className="mt-6 w-full space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm">No links yet</p>
                  <p className="text-white/30 text-xs mt-1">Add links to see them here</p>
                </div>
              ) : (
                links
                  .filter((link) => link.visible)
                  .map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      className={`relative flex w-full items-center justify-center border px-4 py-3 text-sm font-medium transition-all hover:scale-[1.02] ${getButtonRadius()} ${
                        link.spotlight
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {link.spotlight && (
                        <Star className="absolute left-3 h-4 w-4 fill-current" />
                      )}
                      <span className="truncate max-w-[180px]">{link.title}</span>
                      <ExternalLink className="absolute right-3 h-3 w-3 opacity-50" />
                    </button>
                  ))
              )}
            </div>

            {/* Branding */}
            <div className="mt-auto pt-8">
              <p className="text-xs text-white/40">Powered by Ayush</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
