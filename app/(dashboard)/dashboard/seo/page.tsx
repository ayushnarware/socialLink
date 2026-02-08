"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function SEOPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
    canonicalUrl: "",
  })

  useEffect(() => {
    if (!user?._id) return
    fetch("/api/page-settings")
      .then((res) => res.json())
      .then((data) => {
        setSeoData({
          title: data.seoTitle || "",
          description: data.seoDescription || "",
          keywords: data.seoKeywords || "",
          ogImage: data.ogImage || "",
          canonicalUrl: data.canonicalUrl || "",
        })
      })
      .catch(() => toast({ title: "Error", description: "Failed to load SEO settings", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [user?._id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/page-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seoTitle: seoData.title,
          seoDescription: seoData.description,
          seoKeywords: seoData.keywords,
          ogImage: seoData.ogImage,
          canonicalUrl: seoData.canonicalUrl,
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast({ title: "Success", description: "SEO settings saved! Your page meta will update." })
    } catch {
      toast({ title: "Error", description: "Failed to save SEO settings", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
        <p className="text-muted-foreground">
          Optimize your page for search engines and social sharing
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags</CardTitle>
            <CardDescription>
              Configure your page metadata for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Page Title</Label>
              <Input
                id="meta-title"
                placeholder="Your Page Title"
                value={seoData.title}
                onChange={(e) =>
                  setSeoData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                {seoData.title.length}/60 characters (recommended for Google)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-desc">Meta Description</Label>
              <Textarea
                id="meta-desc"
                placeholder="A brief description of your page"
                rows={3}
                value={seoData.description}
                onChange={(e) =>
                  setSeoData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                {seoData.description.length}/160 characters (recommended)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="keyword1, keyword2, keyword3"
                value={seoData.keywords}
                onChange={(e) =>
                  setSeoData((prev) => ({ ...prev, keywords: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Graph</CardTitle>
            <CardDescription>
              Control how your page appears when shared on social media
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="og-image">Social Image URL</Label>
              <Input
                id="og-image"
                placeholder="https://example.com/image.jpg"
                value={seoData.ogImage}
                onChange={(e) =>
                  setSeoData((prev) => ({ ...prev, ogImage: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 1200x630 pixels
              </p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Social Preview
              </p>
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="aspect-video bg-muted">
                  {seoData.ogImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={seoData.ogImage}
                      alt="OG Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image set
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-foreground">
                    {seoData.title || "Your Page Title"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {seoData.description || "Your page description will appear here"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">myprofile.live</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Additional SEO configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="canonical">Canonical URL</Label>
              <Input
                id="canonical"
                placeholder="https://myprofile.live/your-username"
                value={seoData.canonicalUrl}
                onChange={(e) =>
                  setSeoData((prev) => ({ ...prev, canonicalUrl: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Set a canonical URL to avoid duplicate content issues
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
              <div>
                <p className="font-medium text-foreground">Sitemap</p>
                <p className="text-sm text-muted-foreground">
                  Your page is automatically included in our sitemap
                </p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
