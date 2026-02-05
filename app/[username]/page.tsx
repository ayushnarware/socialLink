"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Instagram, Youtube, Twitter, Music, Video, Globe, Wallet, ImageIcon, Home, Facebook, Linkedin, Github, FileText, Link2, LayoutGrid } from "lucide-react"
import { getThemeById, THEMES } from "@/lib/themes"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserLink {
  id: string
  title: string
  url: string
  type: string
  visible: boolean
  spotlight?: boolean
  icon?: string
  clicks: number
  videoUrl?: string
  musicUrl?: string
  images?: string[]
  cryptoAddress?: string
  cryptoType?: string
}

interface ProfileFile {
  id: string
  name: string
  type: string
  views?: number
}

interface ProfileForm {
  id: string
  title: string
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
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
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([])
  const [files, setFiles] = useState<ProfileFile[]>([])
  const [forms, setForms] = useState<ProfileForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState("links")

  const visibleLinks = links.filter((l) => l.visible !== false)
  const filesList = files.filter((f) => f.type !== "image")
  const photosList = files.filter((f) => f.type === "image")

  useEffect(() => {
    if (!username) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    fetch(`/api/profile/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data?.profile) {
          setNotFound(true)
          setIsLoading(false)
          return
        }
        const p = data.profile
        setProfile({
          id: p.username || username,
          username: p.username || username,
          name: p.name || username,
          bio: p.bio || "",
          avatar: p.avatar || null,
          websiteUrl: p.websiteUrl || "",
          plan: p.plan || "free",
        })
        setLinks(p.links || [])
        setDesign(p.theme ? { themeId: p.theme, customColors: p.customColors } : null)
        setSocials(p.socials || [])
        setFiles(p.files || [])
        setForms(p.forms || [])
        setIsLoading(false)
        const hasLinks = (p.links || []).filter((l: { visible?: boolean }) => l.visible !== false).length > 0
        const fileItems = p.files || []
        const hasFiles = fileItems.filter((x: { type: string }) => x.type !== "image").length > 0
        const hasPhotos = fileItems.filter((x: { type: string }) => x.type === "image").length > 0
        const hasForms = (p.forms || []).length > 0
        if (hasLinks) setActiveTab("links")
        else if (hasFiles) setActiveTab("files")
        else if (hasPhotos) setActiveTab("photos")
        else if (hasForms) setActiveTab("forms")
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: p.username || username, type: "pageView" }),
        }).catch(() => {})
      })
      .catch((error) => {
        console.error("Error loading profile:", error)
        setNotFound(true)
        setIsLoading(false)
      })
  }, [username])

  const toAbsoluteUrl = (raw: string) => {
    if (!raw?.trim()) return ""
    const s = raw.trim()
    if (s.startsWith("http://") || s.startsWith("https://")) return s
    if (s.startsWith("/")) return s
    return `https://${s}`
  }

  const handleLinkClick = (link: UserLink) => {
    fetch("/api/links/click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ linkId: link.id }) }).catch(() => {})
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, clicks: (l.clicks || 0) + 1 } : l))
    )
    const raw = link.videoUrl || link.musicUrl || link.url
    if (link.type === "crypto" && link.cryptoAddress) {
      navigator.clipboard.writeText(link.cryptoAddress)
      return
    }
    if (raw) {
      const url = toAbsoluteUrl(raw)
      if (url) window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return ""
    try {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)
        return m ? `https://www.youtube.com/embed/${m[1]}` : url
      }
      if (url.includes("vimeo.com")) {
        const m = url.match(/vimeo\.com\/(\d+)/)
        return m ? `https://player.vimeo.com/video/${m[1]}` : url
      }
    } catch {}
    return url
  }

  const getSpotifyEmbed = (url: string) => {
    if (!url) return ""
    try {
      const m = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
      if (m) return `https://open.spotify.com/embed/${m[1]}/${m[2]}`
    } catch {}
    return url
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

          {/* Social Media Icons */}
          {socials.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || Globe
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                    style={{ backgroundColor: accentColor + "30", color: accentColor }}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Website Link */}
        {profile.websiteUrl && (
          <div className="mt-8">
            <button
              onClick={() => window.open(toAbsoluteUrl(profile.websiteUrl || ""), "_blank", "noopener,noreferrer")}
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

        {/* Instagram-style tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList
            className="w-full h-12 rounded-none border-b px-0 bg-transparent"
            style={{ borderColor: `${textColor}20`, color: textColor }}
          >
            <div className="flex w-full">
              <TabsTrigger
                value="links"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                style={{ color: activeTab === "links" ? textColor : textColor + "99" }}
              >
                <Link2 className="h-4 w-4 mr-1.5 sm:mr-2" />
                Links {visibleLinks.length > 0 && `(${visibleLinks.length})`}
              </TabsTrigger>
              {filesList.length > 0 && (
                <TabsTrigger
                  value="files"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  style={{ color: activeTab === "files" ? textColor : textColor + "99" }}
                >
                  <FileText className="h-4 w-4 mr-1.5 sm:mr-2" />
                  Files ({filesList.length})
                </TabsTrigger>
              )}
              {photosList.length > 0 && (
                <TabsTrigger
                  value="photos"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  style={{ color: activeTab === "photos" ? textColor : textColor + "99" }}
                >
                  <ImageIcon className="h-4 w-4 mr-1.5 sm:mr-2" />
                  Photos ({photosList.length})
                </TabsTrigger>
              )}
              {forms.length > 0 && (
                <TabsTrigger
                  value="forms"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  style={{ color: activeTab === "forms" ? textColor : textColor + "99" }}
                >
                  <LayoutGrid className="h-4 w-4 mr-1.5 sm:mr-2" />
                  Forms ({forms.length})
                </TabsTrigger>
              )}
            </div>
          </TabsList>

          <TabsContent value="links" className="mt-6">
            {visibleLinks.length > 0 ? (
              <div className="space-y-3">
                {visibleLinks.map((link) => (
                  <div key={link.id}>
                    {link.type === "video" && (link.videoUrl || link.url) && (
                      <div className="mb-2 overflow-hidden rounded-xl" style={{ borderRadius: buttonRadius }}>
                        <iframe
                          src={getVideoEmbedUrl(link.videoUrl || link.url)}
                          title={link.title}
                          className="aspect-video w-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    )}
                    {link.type === "music" && (link.musicUrl || link.url) && (
                      <div className="mb-2 overflow-hidden rounded-xl" style={{ borderRadius: buttonRadius }}>
                        <iframe
                          src={getSpotifyEmbed(link.musicUrl || link.url)}
                          title={link.title}
                          width="100%"
                          height="152"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        />
                      </div>
                    )}
                    {link.type === "gallery" && link.images && link.images.length > 0 && (
                      <div className="mb-2 grid grid-cols-2 gap-2">
                        {link.images.slice(0, 4).map((img, i) => (
                          <a key={i} href={toAbsoluteUrl(img) || img} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleLinkClick(link)}
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
                      <span>
                        {link.type === "crypto" && link.cryptoAddress
                          ? `Copy ${link.cryptoType || "Wallet"} Address`
                          : link.title}
                      </span>
                      {link.spotlight && (
                        <span
                          className="absolute right-4 rounded-full px-2 py-0.5 text-xs"
                          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                        >
                          Featured
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center opacity-50" style={{ color: textColor }}>
                <Globe className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4">No links added yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <Carousel opts={{ align: "start", loop: true, dragFree: true }}>
              <CarouselContent className="-ml-2">
                {filesList.map((f) => (
                  <CarouselItem key={f.id} className="pl-2 basis-[85%] sm:basis-[70%]">
                    <Link
                      href={`/share/${profile.username}/${f.id}`}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 transition-all hover:scale-[1.02]"
                      style={{
                        background: isGradient ? "rgba(255,255,255,0.08)" : `${textColor}10`,
                        borderColor: accentColor + "50",
                        color: textColor,
                      }}
                    >
                      <FileText className="h-12 w-12" style={{ color: accentColor }} />
                      <span className="text-sm font-medium truncate max-w-full">{f.name}</span>
                      {f.views !== undefined && <span className="text-xs opacity-60">{f.views} views</span>}
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <Carousel opts={{ align: "start", loop: true, dragFree: true }}>
              <CarouselContent className="-ml-2">
                {photosList.map((f) => (
                  <CarouselItem key={f.id} className="pl-2 basis-[85%] sm:basis-[70%]">
                    <Link
                      href={`/share/${profile.username}/${f.id}`}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 transition-all hover:scale-[1.02]"
                      style={{
                        background: isGradient ? "rgba(255,255,255,0.08)" : `${textColor}10`,
                        borderColor: accentColor + "50",
                        color: textColor,
                      }}
                    >
                      <ImageIcon className="h-12 w-12" style={{ color: accentColor }} />
                      <span className="text-sm font-medium truncate max-w-full">{f.name}</span>
                      {f.views !== undefined && <span className="text-xs opacity-60">{f.views} views</span>}
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <Carousel opts={{ align: "start", loop: true, dragFree: true }}>
              <CarouselContent className="-ml-2">
                {forms.map((f) => (
                  <CarouselItem key={f.id} className="pl-2 basis-[85%] sm:basis-[70%]">
                    <Link
                      href={`/form/${profile.username}/${f.id}`}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 transition-all hover:scale-[1.02]"
                      style={{
                        background: isGradient ? "rgba(255,255,255,0.08)" : `${textColor}10`,
                        borderColor: accentColor + "50",
                        color: textColor,
                      }}
                    >
                      <FileText className="h-12 w-12" style={{ color: accentColor }} />
                      <span className="text-sm font-medium truncate max-w-full">{f.title}</span>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TabsContent>
        </Tabs>

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
