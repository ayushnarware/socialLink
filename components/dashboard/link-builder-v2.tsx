"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Link2,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  Star,
  Video,
  Music,
  ImageIcon,
  Wallet,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LinkItem {
  id: string
  title: string
  url: string
  type: "link" | "button" | "video" | "music" | "gallery" | "crypto"
  visible: boolean
  spotlight?: boolean
  clicks: number
  videoUrl?: string
  musicUrl?: string
  images?: string[]
  cryptoAddress?: string
  cryptoType?: string
}

const linkTypes = [
  { value: "link", label: "Link", icon: Link2 },
  { value: "button", label: "Button", icon: Link2 },
  { value: "video", label: "Video Embed", icon: Video },
  { value: "music", label: "Music", icon: Music },
  { value: "gallery", label: "Gallery", icon: ImageIcon },
  { value: "crypto", label: "Crypto Wallet", icon: Wallet },
]

const STORAGE_KEY = "links"

import { useAuth } from "@/hooks/use-auth"

export function LinkBuilderV2() {
  const { user } = useAuth()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    type: "link" as LinkItem["type"],
    videoUrl: "",
    musicUrl: "",
    images: "",
    cryptoAddress: "",
    cryptoType: "BTC",
  })

  // Load links from localStorage on mount
  useEffect(() => {
    if (!user?.id) return
    const storageKey = `ayush_links_${user.id}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setLinks(JSON.parse(stored))
      } catch (e) {
        console.error("[v0] Failed to parse links from localStorage:", e)
      }
    }
  }, [user?.id])

  // Save links to localStorage whenever they change
  useEffect(() => {
    if (!user?.id) return
    const storageKey = `ayush_links_${user.id}`
    if (links.length >= 0) {
      localStorage.setItem(storageKey, JSON.stringify(links))
    }
  }, [links, user?.id])

  const toggleVisibility = (id: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, visible: !link.visible } : link
      )
    )
  }

  const toggleSpotlight = (id: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, spotlight: !link.spotlight }
          : { ...link, spotlight: false }
      )
    )
  }

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id))
  }

  const addLink = () => {
    if (!newLink.title) return

    const link: LinkItem = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      type: newLink.type,
      visible: true,
      clicks: 0,
      videoUrl: newLink.videoUrl || undefined,
      musicUrl: newLink.musicUrl || undefined,
      images: newLink.images ? newLink.images.split(",").map(s => s.trim()) : undefined,
      cryptoAddress: newLink.cryptoAddress || undefined,
      cryptoType: newLink.cryptoType || undefined,
    }

    setLinks((prev) => [...prev, link])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const updateLink = () => {
    if (!editingLink) return

    setLinks((prev) =>
      prev.map((link) =>
        link.id === editingLink.id
          ? {
              ...link,
              title: newLink.title,
              url: newLink.url,
              type: newLink.type,
              videoUrl: newLink.videoUrl || undefined,
              musicUrl: newLink.musicUrl || undefined,
              images: newLink.images ? newLink.images.split(",").map(s => s.trim()) : undefined,
              cryptoAddress: newLink.cryptoAddress || undefined,
              cryptoType: newLink.cryptoType || undefined,
            }
          : link
      )
    )
    resetForm()
    setEditingLink(null)
  }

  const openEditDialog = (link: LinkItem) => {
    setEditingLink(link)
    setNewLink({
      title: link.title,
      url: link.url,
      type: link.type,
      videoUrl: link.videoUrl || "",
      musicUrl: link.musicUrl || "",
      images: link.images?.join(", ") || "",
      cryptoAddress: link.cryptoAddress || "",
      cryptoType: link.cryptoType || "BTC",
    })
  }

  const resetForm = () => {
    setNewLink({
      title: "",
      url: "",
      type: "link",
      videoUrl: "",
      musicUrl: "",
      images: "",
      cryptoAddress: "",
      cryptoType: "BTC",
    })
  }

  const quickAddLink = (type: LinkItem["type"]) => {
    setNewLink((prev) => ({ ...prev, type }))
    setIsAddDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Links</CardTitle>
        <Dialog
          open={isAddDialogOpen || !!editingLink}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
              setEditingLink(null)
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLink ? "Edit Link" : "Add New Link"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="link-title">Title *</Label>
                <Input
                  id="link-title"
                  placeholder="My awesome link"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-type">Type</Label>
                <Select
                  value={newLink.type}
                  onValueChange={(value) =>
                    setNewLink((prev) => ({
                      ...prev,
                      type: value as LinkItem["type"],
                    }))
                  }
                >
                  <SelectTrigger id="link-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {linkTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(newLink.type === "link" || newLink.type === "button") && (
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL *</Label>
                  <Input
                    id="link-url"
                    placeholder="https://example.com"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink((prev) => ({ ...prev, url: e.target.value }))
                    }
                  />
                </div>
              )}

              {newLink.type === "video" && (
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL (YouTube/Vimeo)</Label>
                  <Input
                    id="video-url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={newLink.videoUrl}
                    onChange={(e) =>
                      setNewLink((prev) => ({ ...prev, videoUrl: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a YouTube or Vimeo URL to embed the video
                  </p>
                </div>
              )}

              {newLink.type === "music" && (
                <div className="space-y-2">
                  <Label htmlFor="music-url">Music URL (Spotify/SoundCloud)</Label>
                  <Input
                    id="music-url"
                    placeholder="https://open.spotify.com/track/..."
                    value={newLink.musicUrl}
                    onChange={(e) =>
                      setNewLink((prev) => ({ ...prev, musicUrl: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a Spotify or SoundCloud URL to embed the track
                  </p>
                </div>
              )}

              {newLink.type === "gallery" && (
                <div className="space-y-2">
                  <Label htmlFor="images">Image URLs (comma-separated)</Label>
                  <Textarea
                    id="images"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    value={newLink.images}
                    onChange={(e) =>
                      setNewLink((prev) => ({ ...prev, images: e.target.value }))
                    }
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter image URLs separated by commas
                  </p>
                </div>
              )}

              {newLink.type === "crypto" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="crypto-type">Cryptocurrency</Label>
                    <Select
                      value={newLink.cryptoType}
                      onValueChange={(value) =>
                        setNewLink((prev) => ({ ...prev, cryptoType: value }))
                      }
                    >
                      <SelectTrigger id="crypto-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        <SelectItem value="BNB">Binance Coin (BNB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crypto-address">Wallet Address</Label>
                    <Input
                      id="crypto-address"
                      placeholder="0x..."
                      value={newLink.cryptoAddress}
                      onChange={(e) =>
                        setNewLink((prev) => ({ ...prev, cryptoAddress: e.target.value }))
                      }
                    />
                  </div>
                </>
              )}

              <Button
                onClick={editingLink ? updateLink : addLink}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={!newLink.title}
              >
                {editingLink ? "Update Link" : "Add Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Link2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium text-foreground">No links yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first link to get started
            </p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`group flex items-center gap-3 rounded-lg border p-3 transition-all ${
                link.visible
                  ? "border-border bg-secondary/30"
                  : "border-border/50 bg-secondary/10 opacity-60"
              } ${link.spotlight ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
            >
              <button
                type="button"
                className="cursor-grab text-muted-foreground hover:text-foreground"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {link.spotlight && (
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  )}
                  <p className="truncate font-medium text-foreground">
                    {link.title}
                  </p>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {link.type === "video" ? "Video Embed" : 
                   link.type === "music" ? "Music" :
                   link.type === "gallery" ? "Gallery" :
                   link.type === "crypto" ? `${link.cryptoType} Wallet` :
                   link.url}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{link.clicks}</span>
                <span>clicks</span>
              </div>

              <button
                type="button"
                onClick={() => openEditDialog(link)}
                className="p-1 text-muted-foreground hover:text-foreground"
                aria-label="Edit link"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleVisibility(link.id)}
                className="p-1 text-muted-foreground hover:text-foreground"
                aria-label={link.visible ? "Hide link" : "Show link"}
              >
                {link.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-1 text-muted-foreground hover:text-foreground"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleSpotlight(link.id)}>
                    <Star className="mr-2 h-4 w-4" />
                    {link.spotlight ? "Remove Spotlight" : "Set as Spotlight"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteLink(link.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}

        {/* Quick add buttons */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => quickAddLink("video")}
          >
            <Video className="h-4 w-4" />
            Video
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => quickAddLink("music")}
          >
            <Music className="h-4 w-4" />
            Music
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => quickAddLink("gallery")}
          >
            <ImageIcon className="h-4 w-4" />
            Gallery
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => quickAddLink("crypto")}
          >
            <Wallet className="h-4 w-4" />
            Crypto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
