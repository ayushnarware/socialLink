"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe, Copy, Check } from "lucide-react"

export function WebsiteLinkSettings() {
  const [website, setWebsite] = useState("https://mywebsite.com")
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = () => {
    // In production, save to database
    setIsEditing(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(website)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Website Link
        </CardTitle>
        <CardDescription>
          Add a link to your website in your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{website}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyLink}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm">
          <p className="text-muted-foreground">
            Your website will appear at the top of your profile with a globe icon, making it easy for visitors to access your site.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
