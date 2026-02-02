"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Zap, Shield, Globe, Sparkles, Music, Wallet, ImageIcon, Video } from "lucide-react"

interface FeatureToggle {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: React.ElementType
  category: "core" | "pro" | "business" | "experimental"
}

const initialFeatures: FeatureToggle[] = [
  {
    id: "analytics",
    name: "Advanced Analytics",
    description: "Detailed visitor analytics including device, location, and referrer data",
    enabled: true,
    icon: Zap,
    category: "core",
  },
  {
    id: "custom-domains",
    name: "Custom Domains",
    description: "Allow users to connect their own domains",
    enabled: true,
    icon: Globe,
    category: "business",
  },
  {
    id: "animated-backgrounds",
    name: "Animated Backgrounds",
    description: "Snow, smoke, waves, and hyperspace effects",
    enabled: true,
    icon: Sparkles,
    category: "pro",
  },
  {
    id: "music-integration",
    name: "Music Integration",
    description: "Spotify, Apple Music, and SoundCloud embeds",
    enabled: true,
    icon: Music,
    category: "pro",
  },
  {
    id: "crypto-links",
    name: "Crypto Wallet Links",
    description: "Accept crypto payments and donations",
    enabled: false,
    icon: Wallet,
    category: "experimental",
  },
  {
    id: "ai-suggestions",
    name: "AI Link Suggestions",
    description: "AI-powered link optimization recommendations",
    enabled: false,
    icon: Sparkles,
    category: "experimental",
  },
  {
    id: "video-backgrounds",
    name: "Video Backgrounds",
    description: "Allow video files as page backgrounds",
    enabled: true,
    icon: Video,
    category: "business",
  },
  {
    id: "gallery-mode",
    name: "Gallery Mode",
    description: "Image gallery with lightbox support",
    enabled: true,
    icon: ImageIcon,
    category: "pro",
  },
]

const configOptions = [
  { id: "max-free-links", label: "Max Links (Free)", value: "5" },
  { id: "max-pro-links", label: "Max Links (Pro)", value: "unlimited" },
  { id: "watermark-text", label: "Free Tier Watermark", value: "Powered by Ayush" },
  { id: "trial-days", label: "Pro Trial Days", value: "14" },
]

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureToggle[]>(initialFeatures)
  const [config, setConfig] = useState(configOptions)

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
      )
    )
  }

  const updateConfig = (id: string, value: string) => {
    setConfig((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    )
  }

  const getCategoryColor = (category: FeatureToggle["category"]) => {
    switch (category) {
      case "core":
        return "bg-blue-500/10 text-blue-500"
      case "pro":
        return "bg-green-500/10 text-green-500"
      case "business":
        return "bg-purple-500/10 text-purple-500"
      case "experimental":
        return "bg-orange-500/10 text-orange-500"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feature Toggles</h1>
        <p className="text-muted-foreground">
          Enable or disable features across the platform
        </p>
      </div>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Toggle features on or off for all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{feature.name}</p>
                      <Badge className={getCategoryColor(feature.category)}>
                        {feature.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>
            Adjust platform-wide settings and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.map((item) => (
              <div key={item.id} className="space-y-2">
                <Label htmlFor={item.id}>{item.label}</Label>
                <Input
                  id={item.id}
                  value={item.value}
                  onChange={(e) => updateConfig(item.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="border-amber-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Maintenance Mode
          </CardTitle>
          <CardDescription>
            Enable maintenance mode to temporarily disable the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                Platform Maintenance Mode
              </p>
              <p className="text-sm text-muted-foreground">
                When enabled, all users will see a maintenance page
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
