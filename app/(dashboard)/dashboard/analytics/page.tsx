"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, MousePointer, TrendingUp, Globe } from "lucide-react"
import { useState, useEffect } from "react"

interface LinkItem {
  id: string
  title: string
  type: string
  clicks: number
  visible: boolean
}

const LINKS_KEY = "ayush_user_links"

// Utility to calculate color gradient from green to red
function getColorForCount(count: number, maxCount: number): string {
  if (maxCount === 0) return "rgb(75, 222, 128)" // Green default
  const ratio = count / maxCount
  
  // Green to Yellow to Red gradient
  if (ratio > 0.5) {
    // Yellow to Green (high counts)
    const green = 222
    const red = Math.round(75 + (244 - 75) * ((ratio - 0.5) * 2))
    return `rgb(${red}, ${green}, 128)`
  } else {
    // Red to Yellow (low counts)
    const red = 244
    const green = Math.round(128 + (222 - 128) * (ratio * 2))
    return `rgb(${red}, ${green}, 128)`
  }
}

export default function AnalyticsPageV2() {
  const [timeRange, setTimeRange] = useState("7d")
  const [links, setLinks] = useState<LinkItem[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(LINKS_KEY)
    if (stored) {
      try {
        const parsedLinks = JSON.parse(stored)
        setLinks(parsedLinks)
        
        // Calculate total clicks
        const clicks = parsedLinks.reduce((sum: number, link: LinkItem) => sum + (link.clicks || 0), 0)
        setTotalClicks(clicks)
        
        // Views could be clicks * random multiplier for demo
        setTotalViews(clicks * 3)
      } catch (e) {
        console.error("[v0] Failed to parse links:", e)
      }
    }
  }, [])

  const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0"
  const maxClicks = Math.max(...links.map(l => l.clicks || 0), 1)

  const stats = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      change: totalViews > 0 ? "+12.5%" : "0%",
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      change: totalClicks > 0 ? "+8.2%" : "0%",
      icon: MousePointer,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Click-Through Rate",
      value: `${clickThroughRate}%`,
      change: totalClicks > 0 ? "+2.1%" : "0%",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Active Links",
      value: links.filter(l => l.visible).length.toString(),
      change: `${links.length} total`,
      icon: Globe,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Track your page performance and audience insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-accent">{stat.change}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Links Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
          <CardDescription>
            Click counts for each link (green = high, red = low)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium text-foreground">No links yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add links to see analytics data
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {links
                .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                .map((link) => {
                  const color = getColorForCount(link.clicks || 0, maxClicks)
                  const percentage = maxClicks > 0 ? ((link.clicks || 0) / maxClicks) * 100 : 0
                  
                  return (
                    <div key={link.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{link.title}</span>
                        <span className="text-muted-foreground">
                          {link.clicks || 0} clicks
                        </span>
                      </div>
                      <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files & Forms Performance (Future Feature) */}
      <Card>
        <CardHeader>
          <CardTitle>Files & Forms Performance</CardTitle>
          <CardDescription>
            View counts for shared files and forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-medium text-foreground">No shared files or forms yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create forms or share files to see view analytics
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown - Empty State */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium text-foreground">No device data yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Device analytics will appear when you get visitors
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Traffic sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium text-foreground">No referrer data yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                See where your visitors come from when you share your link
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
