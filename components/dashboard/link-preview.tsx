"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, Star, ExternalLink, FileText, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { getThemeById, THEMES } from "@/lib/themes"
import { Instagram, Youtube, Twitter, Facebook, Linkedin, Github, Globe } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

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

interface PreviewFile {
  id: string
  name: string
  type: string
  content?: string
  views?: number
}

interface PreviewForm {
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

export function LinkPreview() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile")
  const [profile, setProfile] = useState<{ name: string; bio: string; avatar: string | null } | null>(null)
  const [links, setLinks] = useState<UserLink[]>([])
  const [design, setDesign] = useState<{ themeId: string; customColors?: { background: string; accent: string } } | null>(null)
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([])
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [forms, setForms] = useState<PreviewForm[]>([])

  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"

  useEffect(() => {
    if (!user?._id) return

    const load = async () => {
      try {
        const [linksRes, settingsRes, filesRes, formsRes] = await Promise.all([
          fetch("/api/links"),
          fetch("/api/page-settings"),
          fetch("/api/files"),
          fetch("/api/forms"),
        ])
        const linksData = await linksRes.json()
        const settingsData = await settingsRes.json()
        const filesData = await filesRes.json()
        const formsData = await formsRes.json()
        if (linksData.links) setLinks(linksData.links)
        if (settingsData.themeId || settingsData.customColors) {
          setDesign({
            themeId: settingsData.themeId || "midnight",
            customColors: settingsData.customColors,
          })
        }
        setProfile({
          name: user.name || username,
          bio: user.bio || "",
          avatar: user.avatar || null,
        })
        if (user.socials && Array.isArray(user.socials)) setSocials(user.socials)
        if (filesData.files) {
          setFiles(filesData.files.map((f: { id: string; name: string; type: string; content?: string; views?: number }) => ({ 
            id: f.id, 
            name: f.name, 
            type: f.type, 
            content: f.content,
            views: f.views 
          })))
        }
        if (formsData.forms) setForms(formsData.forms.map((f: { id: string; title: string }) => ({ id: f.id, title: f.title })))
      } catch {}
    }

    load()
    const interval = setInterval(load, 2000)
    return () => clearInterval(interval)
  }, [user, username])

  const theme = design?.themeId ? getThemeById(design.themeId) : THEMES[0]
  const backgroundColor = design?.customColors?.background || theme?.colors.background || "#0a0a0a"
  const accentColor = design?.customColors?.accent || theme?.colors.accent || "#10b981"
  const textColor = theme?.colors.text || "#ffffff"
  const buttonStyle = theme?.buttonStyle || "rounded"
  const buttonRadius = buttonStyle === "pill" ? "rounded-full" : buttonStyle === "sharp" ? "rounded" : "rounded-xl"
  const isGradient = backgroundColor.includes("gradient")

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
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
          style={{ background: backgroundColor, fontFamily: theme?.fontFamily || "Inter, sans-serif", color: textColor }}
        >
          {viewMode === "mobile" && (
            <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground/20" />
          )}

          <div className="flex h-full flex-col items-center overflow-y-auto px-4 pt-12 pb-8">
            {profile?.avatar ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4" style={{ borderColor: accentColor }}>
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
              </div>
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full border-4 text-2xl font-bold"
                style={{ borderColor: accentColor, backgroundColor: isGradient ? "rgba(255,255,255,0.1)" : accentColor + "20", color: accentColor }}
              >
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <h3 className="mt-4 text-lg font-bold" style={{ color: textColor }}>@{username}</h3>
            {profile?.bio && <p className="mt-1 text-center text-sm max-w-[200px] opacity-80" style={{ color: textColor }}>{profile.bio}</p>}

            {socials.length > 0 && (
              <div className="mt-2 flex gap-2">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || Globe
                  return <div key={s.platform} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: accentColor + "30", color: accentColor }}><Icon className="h-4 w-4" /></div>
                })}
              </div>
            )}

            <div className="mt-6 w-full space-y-3">
              {links.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm opacity-40">No links yet</p>
                </div>
              ) : (
                links
                  .filter((l) => l.visible)
                  .map((link) => (
                    <div
                      key={link.id}
                      className={`flex w-full items-center justify-center border px-4 py-3 text-sm font-medium ${buttonRadius}`}
                      style={{
                        background: link.spotlight ? accentColor : isGradient ? "rgba(255,255,255,0.1)" : textColor + "15",
                        color: link.spotlight ? "#fff" : textColor,
                        borderColor: link.spotlight ? accentColor : textColor + "30",
                      }}
                    >
                      {link.spotlight && <Star className="mr-2 h-4 w-4 fill-current shrink-0" />}
                      <span className="truncate max-w-[180px]">{link.title}</span>
                      <ExternalLink className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </div>
                  ))
              )}
            </div>

            {/* Files - like public profile */}
            {files.filter((f) => f.type !== "image").length > 0 && (
              <div className="mt-6 w-full">
                <p className="mb-2 text-xs opacity-70">Files</p>
                <Carousel opts={{ align: "start", loop: false, dragFree: true }}>
                  <CarouselContent className="-ml-2">
                    {files.filter((f) => f.type !== "image").slice(0, 3).map((f) => (
                      <CarouselItem key={f.id} className="pl-2 basis-[70%]">
                        <div className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 ${buttonRadius}`} style={{ background: isGradient ? "rgba(255,255,255,0.08)" : textColor + "10", borderColor: accentColor + "50", color: textColor }}>
                          <FileText className="h-8 w-8" style={{ color: accentColor }} />
                          <span className="text-xs font-medium truncate max-w-full">{f.name}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}

            {/* Photos - like public profile */}
            {files.filter((f) => f.type === "image").length > 0 && (
              <div className="mt-6 w-full">
                <p className="mb-2 text-xs opacity-70">Photos</p>
                <Carousel opts={{ align: "start", loop: false, dragFree: true }}>
                  <CarouselContent className="-ml-2">
                    {files.filter((f) => f.type === "image").slice(0, 3).map((f) => (
                      <CarouselItem key={f.id} className="pl-2 basis-[70%]">
                        <div className={`flex flex-col gap-1 rounded-xl border-2 p-2 ${buttonRadius}`} style={{ background: isGradient ? "rgba(255,255,255,0.08)" : textColor + "10", borderColor: accentColor + "50", color: textColor }}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/20">
                            {f.content ? (
                              <Image src={f.content} alt={f.name} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-6 w-6 opacity-50" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-medium truncate px-1">{f.name}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}

            {/* Forms - like public profile */}
            {forms.length > 0 && (
              <div className="mt-4 w-full">
                <p className="mb-2 text-xs opacity-70">Forms</p>
                <Carousel opts={{ align: "start", loop: false, dragFree: true }}>
                  <CarouselContent className="-ml-2">
                    {forms.slice(0, 3).map((f) => (
                      <CarouselItem key={f.id} className="pl-2 basis-[70%]">
                        <div className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 ${buttonRadius}`} style={{ background: isGradient ? "rgba(255,255,255,0.08)" : textColor + "10", borderColor: accentColor + "50", color: textColor }}>
                          <FileText className="h-8 w-8" style={{ color: accentColor }} />
                          <span className="text-xs font-medium truncate max-w-full">{f.title}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}

            <div className="mt-auto pt-8">
              <p className="text-xs opacity-40">Powered by MyProfile.live</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
