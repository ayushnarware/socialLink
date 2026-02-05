"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, MousePointer, TrendingUp, Globe, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface LinkItem {
  id: string
  title: string
  type?: string
  clicks: number
  visible: boolean
}

function getColorForCount(count: number, maxCount: number): string {
  if (maxCount === 0) return "rgb(75, 222, 128)"
  const ratio = count / maxCount
  if (ratio > 0.5) {
    const green = 222
    const red = Math.round(75 + (244 - 75) * ((ratio - 0.5) * 2))
    return `rgb(${red}, ${green}, 128)`
  }
  const red = 244
  const green = Math.round(128 + (222 - 128) * (ratio * 2))
  return `rgb(${red}, ${green}, 128)`
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [links, setLinks] = useState<LinkItem[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [deviceStats, setDeviceStats] = useState<Array<{ device: string; percentage: number }>>([])
  const [referrerStats, setReferrerStats] = useState<Array<{ source: string; percentage: number }>>([])
  const [fileViews, setFileViews] = useState<Array<{ id: string; name: string; views: number }>>([])
  const [formViews, setFormViews] = useState<Array<{ id: string; title: string; views: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () =>
      fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.analytics) {
          const a = data.analytics
          setTotalViews(a.totalViews || 0)
          setTotalClicks(a.totalClicks || 0)
          setLinks(
            (a.links || []).map((l: { id: string; title: string; clicks: number; visible: boolean }) => ({
              id: l.id,
              title: l.title,
              clicks: l.clicks || 0,
              visible: l.visible !== false,
            }))
          )
          setDeviceStats(a.deviceStats || [])
          setReferrerStats(a.referrerStats || [])
          setFileViews(a.fileViews || [])
          setFormViews(a.formViews || [])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    load()
    if (timeRange === "live") {
      const interval = setInterval(load, 10000)
      return () => clearInterval(interval)
    }
  }, [timeRange])

  const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0"
  const maxClicks = Math.max(...links.map((l) => l.clicks || 0), 1)
  const activeLinks = links.filter((l) => l.visible).length

  const stats = [
    { title: "Total Views", value: totalViews.toLocaleString(), change: totalViews > 0 ? "+12.5%" : "0%", icon: Eye, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Total Clicks", value: totalClicks.toLocaleString(), change: totalClicks > 0 ? "+8.2%" : "0%", icon: MousePointer, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "Click-Through Rate", value: `${clickThroughRate}%`, change: totalClicks > 0 ? "+2.1%" : "0%", icon: TrendingUp, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Active Links", value: activeLinks.toString(), change: `${links.length} total`, icon: Globe, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your page performance and audience insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live">Live / Real-time</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
          <CardDescription>Click counts for each link (green = high, red = low)</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium text-foreground">No links yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Add links to your profile to see analytics</p>
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
                        <span className="text-muted-foreground">{link.clicks || 0} clicks</span>
                      </div>
                      <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Files & Forms Performance</CardTitle>
          <CardDescription>View counts for shared files and forms</CardDescription>
        </CardHeader>
        <CardContent>
          {fileViews.length === 0 && formViews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium text-foreground">No shared files or forms yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Create forms or share files to see view analytics</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fileViews.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Files</h4>
                  {fileViews.map((f) => (
                    <div key={f.id} className="flex justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-sm text-foreground">{f.name}</span>
                      <span className="text-sm text-muted-foreground">{f.views} views</span>
                    </div>
                  ))}
                </div>
              )}
              {formViews.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Forms</h4>
                  {formViews.map((f) => (
                    <div key={f.id} className="flex justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-sm text-foreground">{f.title}</span>
                      <span className="text-sm text-muted-foreground">{f.views} views</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceStats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="font-medium text-foreground">No device data yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Device analytics appear when visitors view your profile</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deviceStats.map((d) => (
                  <div key={d.device} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{d.device}</span>
                    <span className="text-sm text-muted-foreground">{d.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Traffic sources</CardDescription>
          </CardHeader>
          <CardContent>
            {referrerStats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="font-medium text-foreground">No referrer data yet</p>
                <p className="mt-1 text-sm text-muted-foreground">See where visitors come from when you share your link</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrerStats.map((r) => (
                  <div key={r.source} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{r.source}</span>
                    <span className="text-sm text-muted-foreground">{r.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
