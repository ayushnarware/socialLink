"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Instagram, Youtube, Twitter, Music, Video, Globe, Wallet, ImageIcon, Home } from "lucide-react"
import { getThemeById, THEMES } from "@/lib/themes"

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
  id: string
  username: string
  name: string
  bio: string
  avatar: string | null
  websiteUrl?: string
  plan: string
}

interface DesignSettings {
  themeId: string
  customColors?: {
    background: string
    accent: string
  }
}

function getIcon(icon: string) {
  const iconClass = "h-5 w-5"
  switch (icon) {
    case "youtube":
      return <Youtube className={iconClass} />
    case "instagram":
      return <Instagram className={iconClass} />
    case "twitter":
      return <Twitter className={iconClass} />
    case "music":
      return <Music className={iconClass} />
    case "video":
      return <Video className={iconClass} />
    case "crypto":
      return <Wallet className={iconClass} />
    case "gallery":
      return <ImageIcon className={iconClass} />
    case "globe":
    default:
      return <Globe className={iconClass} />
  }
}

export default function PublicProfilePage() {
  const params = useParams()
  const username = params?.username as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [links, setLinks] = useState<UserLink[]>([])
  const [design, setDesign] = useState<DesignSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!username) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    // Try to find user by checking the ayush_demo_auth storage
    try {
      const authData = localStorage.getItem("ayush_demo_auth")
      if (authData) {
        const authUser = JSON.parse(authData)
        const storedUsername = authUser.username || authUser.name?.toLowerCase().replace(/[^a-z0-9]/g, "")
        
        if (storedUsername === username.toLowerCase()) {
          // Load profile data
          const profileKey = `ayush_profile_${authUser.id}`
          const storedProfile = localStorage.getItem(profileKey)
          const profileData = storedProfile ? JSON.parse(storedProfile) : {}

          setProfile({
            id: authUser.id,
            username: profileData.username || storedUsername,
            name: profileData.name || authUser.name,
            bio: profileData.bio || "",
            avatar: profileData.avatar || null,
            websiteUrl: profileData.websiteUrl || "",
            plan: authUser.plan || "free",
          })

          // Load links
          const linksKey = `ayush_links_${authUser.id}`
          const storedLinks = localStorage.getItem(linksKey)
          setLinks(storedLinks ? JSON.parse(storedLinks) : [])

          // Load design
          const designKey = `ayush_design_${authUser.id}`
          const storedDesign = localStorage.getItem(designKey)
          if (storedDesign) {
            setDesign(JSON.parse(storedDesign))
          }
          
          setIsLoading(false)
          return
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }

    setNotFound(true)
    setIsLoading(false)
  }, [username])

  const handleLinkClick = (linkId: string, url: string) => {
    if (profile) {
      const linksKey = `ayush_links_${profile.id}`
      const updatedLinks = links.map((link) =>
        link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
      )
      localStorage.setItem(linksKey, JSON.stringify(updatedLinks))
      setLinks(updatedLinks)
    }
    window.open(url, "_blank")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800">
            <Globe className="h-12 w-12 text-zinc-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Profile Not Found</h1>
          <p className="mt-3 max-w-md text-zinc-400">
            The profile <span className="font-mono text-emerald-400">@{username}</span> doesn't exist or hasn't been set up yet.
          </p>
          <Link 
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Get theme settings
  const theme = design?.themeId ? getThemeById(design.themeId) : THEMES[0]
  const backgroundColor = design?.customColors?.background || theme?.colors.background || "#0a0a0a"
  const accentColor = design?.customColors?.accent || theme?.colors.accent || "#10b981"
  const textColor = theme?.colors.text || "#ffffff"
  const fontFamily = theme?.fontFamily || "Inter, sans-serif"
  const buttonStyle = theme?.buttonStyle || "rounded"
  const buttonRadius = buttonStyle === "pill" ? "9999px" : buttonStyle === "sharp" ? "4px" : "12px"

  const isGradient = backgroundColor.includes("gradient")

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: backgroundColor,
        fontFamily: fontFamily,
        color: textColor,
      }}
    >
      <div className="mx-auto max-w-lg">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {profile.avatar ? (
            <Image
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full border-4 object-cover"
              style={{ borderColor: accentColor }}
            />
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full border-4 text-4xl font-bold"
              style={{
                borderColor: accentColor,
                backgroundColor: isGradient ? "rgba(255,255,255,0.1)" : accentColor + "20",
                color: accentColor,
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="mt-5 text-3xl font-bold" style={{ color: textColor }}>
            {profile.name}
          </h1>

          {profile.bio && (
            <p className="mt-3 max-w-md text-balance opacity-80" style={{ color: textColor }}>
              {profile.bio}
            </p>
          )}

          <p className="mt-2 font-mono text-sm opacity-50" style={{ color: textColor }}>
            @{profile.username}
          </p>
        </div>

        {/* Website Link */}
        {profile.websiteUrl && (
          <div className="mt-8">
            <button
              onClick={() => window.open(profile.websiteUrl, "_blank")}
              className="group relative flex w-full items-center justify-center gap-3 px-6 py-4 text-center font-semibold transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: accentColor,
                color: "#ffffff",
                borderRadius: buttonRadius,
              }}
            >
              <span className="absolute left-5 opacity-70">
                <Globe className="h-5 w-5" />
              </span>
              <span>Visit My Website</span>
              <span className="absolute right-4 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                Website
              </span>
            </button>
          </div>
        )}

        {/* Links */}
        <div className="mt-6 space-y-3">
          {links.length > 0 ? (
            links
              .filter((link) => link.visible !== false)
              .map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="group relative flex w-full items-center justify-center gap-3 border px-6 py-4 text-center font-medium transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    background: link.spotlight ? accentColor : isGradient ? "rgba(255,255,255,0.1)" : `${textColor}10`,
                    color: link.spotlight ? "#ffffff" : textColor,
                    borderColor: link.spotlight ? accentColor : isGradient ? "rgba(255,255,255,0.2)" : `${textColor}20`,
                    borderRadius: buttonRadius,
                  }}
                >
                  <span className="absolute left-5 opacity-60">
                    {getIcon(link.icon || link.type || "globe")}
                  </span>
                  <span>{link.title}</span>
                  {link.spotlight && (
                    <span 
                      className="absolute right-4 rounded-full px-2 py-0.5 text-xs"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      Featured
                    </span>
                  )}
                </button>
              ))
          ) : (
            <div className="py-16 text-center opacity-50" style={{ color: textColor }}>
              <Globe className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-4">No links added yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {profile.plan === "free" && (
          <div className="mt-16 text-center">
            <Link 
              href="/"
              className="text-sm opacity-40 transition-opacity hover:opacity-60" 
              style={{ color: textColor }}
            >
              Powered by Ayush
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
