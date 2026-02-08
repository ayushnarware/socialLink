"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe, Lock, CheckCircle2, Crown, Copy, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

export default function DomainsPage() {
  const { user } = useAuth()
  const [domain, setDomain] = useState("")
  const isPro = user?.plan === "pro" || user?.plan === "business"
  const username = user?.username || user?.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "yourname"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: "Link copied to clipboard" })
  }

  const openProfile = () => {
    window.open(`/${username}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Custom Domains</h1>
        <p className="text-muted-foreground">
          Connect your own domain for a professional, branded experience
        </p>
      </div>

      {!isPro && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <Crown className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Business Plan Required</p>
              <p className="text-sm text-muted-foreground">
                Custom domains are available on the Business plan
              </p>
            </div>
            <Button className="bg-amber-500 text-white hover:bg-amber-600">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Your Default Profile Link */}
      <Card className="border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            Your Profile Link
          </CardTitle>
          <CardDescription>
            Share this link with anyone to show your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex-1">
              <p className="font-mono text-lg font-medium text-foreground">
                myprofile.live/{username}
              </p>
              <p className="text-sm text-muted-foreground">Your default profile URL</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(`${window.location.origin}/${username}`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={openProfile}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Active and ready to share</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Custom Domain</CardTitle>
          <CardDescription>
            Use your own domain instead of myprofile.live
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <div className="flex gap-2">
              <Input
                id="domain"
                placeholder="links.yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={!isPro}
              />
              <Button disabled={!isPro}>
                <Globe className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </div>
          </div>

          {/* DNS Instructions */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="mb-3 font-medium text-foreground">DNS Configuration</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Add the following DNS record to your domain provider:
            </p>
            <div className="overflow-x-auto rounded-lg bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-mono text-foreground">CNAME</td>
                    <td className="px-4 py-2 font-mono text-foreground">links</td>
                    <td className="px-4 py-2 font-mono text-foreground">
                      cname.myprofile.live
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Domains */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
          <CardDescription>Domains currently connected to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Default domain */}
            <div className="flex items-center gap-4 rounded-lg border border-accent/30 bg-accent/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">myprofile.live/{username}</p>
                <p className="text-sm text-muted-foreground">Default domain (always active)</p>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>

            {/* Empty state for custom domains */}
            {!isPro && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 font-medium text-foreground">Custom domains locked</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to Business plan to add custom domains
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
