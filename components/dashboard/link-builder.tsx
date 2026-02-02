"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  type: "link" | "button" | "video" | "music" | "gallery" | "social"
  visible: boolean
  spotlight?: boolean
  clicks: number
}

const linkTypes = [
  { value: "link", label: "Link", icon: Link2 },
  { value: "button", label: "Button", icon: Link2 },
  { value: "video", label: "Video Embed", icon: Video },
  { value: "music", label: "Music", icon: Music },
  { value: "gallery", label: "Gallery", icon: ImageIcon },
  { value: "social", label: "Social", icon: Link2 },
]

const initialLinks: LinkItem[] = [
  {
    id: "1",
    title: "My Portfolio",
    url: "https://portfolio.example.com",
    type: "link",
    visible: true,
    spotlight: true,
    clicks: 234,
  },
  {
    id: "2",
    title: "Follow me on YouTube",
    url: "https://youtube.com/@example",
    type: "link",
    visible: true,
    clicks: 156,
  },
  {
    id: "3",
    title: "Latest Video",
    url: "https://youtube.com/watch?v=abc123",
    type: "video",
    visible: true,
    clicks: 89,
  },
  {
    id: "4",
    title: "Shop My Merch",
    url: "https://shop.example.com",
    type: "button",
    visible: false,
    clicks: 45,
  },
]

export function LinkBuilder() {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    type: "link" as LinkItem["type"],
  })

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
    if (!newLink.title || !newLink.url) return

    const link: LinkItem = {
      id: Date.now().toString(),
      ...newLink,
      visible: true,
      clicks: 0,
    }

    setLinks((prev) => [...prev, link])
    setNewLink({ title: "", url: "", type: "link" })
    setIsAddDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Links</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="link-title">Title</Label>
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
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, url: e.target.value }))
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
              <Button
                onClick={addLink}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Add Link
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
                <p className="truncate text-sm text-muted-foreground">
                  {link.url}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{link.clicks}</span>
                <span>clicks</span>
              </div>

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
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Video className="h-4 w-4" />
            Video
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Music className="h-4 w-4" />
            Music
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ImageIcon className="h-4 w-4" />
            Gallery
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            Crypto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
