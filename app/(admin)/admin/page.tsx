"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, DollarSign, Link2, Eye, TrendingUp, TrendingDown } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { date: "Jan", revenue: 4200, users: 120 },
  { date: "Feb", revenue: 5800, users: 185 },
  { date: "Mar", revenue: 7200, users: 250 },
  { date: "Apr", revenue: 8100, users: 310 },
  { date: "May", revenue: 9500, users: 380 },
  { date: "Jun", revenue: 11200, users: 450 },
]

const stats = [
  {
    title: "Total Users",
    value: "12,456",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Monthly Revenue",
    value: "$24,580",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Total Links",
    value: "156,234",
    change: "+8.4%",
    trend: "up",
    icon: Link2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Page Views",
    value: "2.4M",
    change: "-2.1%",
    trend: "down",
    icon: Eye,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
]

const recentUsers = [
  { name: "John Doe", email: "john@example.com", plan: "Pro", joined: "2 hours ago" },
  { name: "Jane Smith", email: "jane@example.com", plan: "Free", joined: "5 hours ago" },
  { name: "Bob Wilson", email: "bob@example.com", plan: "Business", joined: "1 day ago" },
  { name: "Alice Brown", email: "alice@example.com", plan: "Pro", joined: "2 days ago" },
]

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">
          Platform statistics and management dashboard
        </p>
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
                  <div className="mt-1 flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & User Growth</CardTitle>
          <CardDescription>Monthly trends for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "#4ade80" },
              users: { label: "Users", color: "#60a5fa" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4ade80"
                  fill="url(#revenueGradient)"
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      user.plan === "Business"
                        ? "bg-purple-500/10 text-purple-500"
                        : user.plan === "Pro"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.plan}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{user.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
