"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect, useRef } from "react"
import { Loader2, Trash2, Upload, Camera } from "lucide-react"
import { WebsiteLinkSettings } from "@/components/dashboard/website-link-settings"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export default function SettingsPage() {
  const { user, logout, mutate } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    websiteUrl: "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    analytics: true,
  })

  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        username: user.username || username,
        bio: user.bio || "",
        websiteUrl: user.websiteUrl || "",
      })
      setAvatar(user.avatar || null)
    }
  }, [user, username])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "Image too large. Max 2MB.", variant: "destructive" })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file.", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setAvatar(dataUrl)
      toast({ title: "Success", description: "Avatar uploaded! Click Save to apply." })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user) return
    setIsLoading(true)
    const abortController = new AbortController()

    try {
      if (profile.username !== (user.username || username)) {
        const checkRes = await fetch(`/api/profile/check-username?username=${encodeURIComponent(profile.username)}`, { signal: abortController.signal })
        const checkData = await checkRes.json()
        if (!checkData.available) {
          toast({ title: "Username unavailable", description: "This username is already taken", variant: "destructive" })
          setIsLoading(false)
          return
        }
      }
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          username: profile.username,
          bio: profile.bio,
          avatar: avatar,
          websiteUrl: profile.websiteUrl || "",
        }),
        signal: abortController.signal,
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) throw new Error("Username is already taken")
        throw new Error(data.error || "Failed to save")
      }
      mutate(abortController.signal)
      toast({ title: "Success", description: "Profile saved successfully!" })
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        toast({
          title: "Error",
          description: err.message || "Failed to save profile",
          variant: "destructive",
        })
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatar ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={avatar || "/placeholder.svg"}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground">
                  {profile.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Max 2MB, JPG/PNG/GIF</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                myprofile.live/
                </span>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s+/g, "") }))
                  }
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell people about yourself"
              rows={3}
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and promotions
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, marketing: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Analytics Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly analytics summaries
              </p>
            </div>
            <Switch
              checked={notifications.analytics}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, analytics: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Website Link Settings */}
      <WebsiteLinkSettings />

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
            <div>
              <p className="font-medium text-foreground">Log Out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
