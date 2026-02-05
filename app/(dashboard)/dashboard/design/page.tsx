"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Check, Crown, Lock, Save, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { THEMES, canAccessTheme } from "@/lib/themes"

const STORAGE_KEY = "ayush_design"

export default function DesignPage() {
  const { user } = useAuth()
  const [selectedThemeId, setSelectedThemeId] = useState("midnight")
  const [customColors, setCustomColors] = useState({
    background: "",
    accent: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user?._id) return
    fetch("/api/page-settings")
      .then((res) => res.json())
      .then((data) => {
        setSelectedThemeId(data.themeId || "midnight")
        if (data.customColors) setCustomColors(data.customColors)
      })
      .catch(console.error)
  }, [user?._id])

  const handleSaveDesign = async () => {
    if (!user?._id) return
    setIsSaving(true)

    const selectedTheme = THEMES.find((t) => t.id === selectedThemeId)
    if (!selectedTheme) return

    if (selectedTheme.isPremium && !canAccessTheme(selectedTheme, user?.plan || "free")) {
      toast({
        title: "Premium Theme",
        description: "Upgrade to Pro or Business to use this theme",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    const res = await fetch("/api/page-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        themeId: selectedThemeId,
        customColors: customColors.background || customColors.accent ? customColors : undefined,
      }),
    })

    setIsSaving(false)
    if (res.ok) {
      toast({ title: "Design Saved", description: "Your profile design has been updated" })
    }
  }

  const userPlan = user?.plan || "free"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Design Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Customize the look and feel of your public profile
        </p>
      </div>

      {/* Free Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Free Themes
          </CardTitle>
          <CardDescription>Available on all plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.filter((theme) => !theme.isPremium).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all hover:scale-105 ${
                  selectedThemeId === theme.id
                    ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-background"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <div
                  className="mb-3 h-24 rounded-md"
                  style={{
                    background: theme.colors.background,
                  }}
                />
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{theme.name}</h4>
                  {selectedThemeId === theme.id && (
                    <Check className="h-5 w-5 text-accent" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{theme.fontFamily}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Themes */}
      <Card className="border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-accent" />
            Premium Themes
          </CardTitle>
          <CardDescription>
            {userPlan === "free"
              ? "Upgrade to Pro or Business to unlock premium themes"
              : "Available with your plan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.filter((theme) => theme.isPremium).map((theme) => {
              const canAccess = canAccessTheme(theme, userPlan)

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    if (canAccess) {
                      setSelectedThemeId(theme.id)
                    } else {
                      toast({
                        title: "Premium Theme Locked",
                        description: "Upgrade to Pro to unlock this theme",
                        variant: "destructive",
                      })
                    }
                  }}
                  className={`relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all ${
                    canAccess ? "hover:scale-105" : "opacity-60"
                  } ${
                    selectedThemeId === theme.id
                      ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  {!canAccess && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div
                    className="mb-3 h-24 rounded-md"
                    style={{
                      background: theme.colors.background,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{theme.name}</h4>
                    {selectedThemeId === theme.id && (
                      <Check className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{theme.fontFamily}</p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Colors</CardTitle>
          <CardDescription>
            Fine-tune your profile colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={customColors.background}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, background: e.target.value })
                  }
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={customColors.background}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, background: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={customColors.accent}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, accent: e.target.value })
                  }
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={customColors.accent}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, accent: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveDesign}
          disabled={isSaving}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Design
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
