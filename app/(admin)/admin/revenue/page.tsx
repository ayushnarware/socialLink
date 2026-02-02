"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"

const revenueByMonth = [
  { month: "Jan", stripe: 8500, razorpay: 2100 },
  { month: "Feb", stripe: 9200, razorpay: 2800 },
  { month: "Mar", stripe: 10500, razorpay: 3200 },
  { month: "Apr", stripe: 11800, razorpay: 3600 },
  { month: "May", stripe: 13200, razorpay: 4100 },
  { month: "Jun", stripe: 15000, razorpay: 4800 },
]

const planDistribution = [
  { name: "Free", value: 8500, color: "#6b7280" },
  { name: "Pro", value: 3200, color: "#4ade80" },
  { name: "Business", value: 756, color: "#a855f7" },
]

const recentTransactions = [
  { id: "1", user: "john@example.com", amount: "$29.00", plan: "Business", date: "Feb 1, 2026", method: "Stripe" },
  { id: "2", user: "jane@example.com", amount: "₹499", plan: "Pro", date: "Feb 1, 2026", method: "Razorpay" },
  { id: "3", user: "bob@example.com", amount: "$9.00", plan: "Pro", date: "Jan 31, 2026", method: "Stripe" },
  { id: "4", user: "alice@example.com", amount: "$29.00", plan: "Business", date: "Jan 30, 2026", method: "Stripe" },
  { id: "5", user: "charlie@example.com", amount: "₹1999", plan: "Business", date: "Jan 30, 2026", method: "Razorpay" },
]

const stats = [
  {
    title: "Monthly Revenue",
    value: "$19,800",
    change: "+15.2%",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Stripe Revenue",
    value: "$15,000",
    change: "+12.8%",
    icon: CreditCard,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Razorpay Revenue",
    value: "₹3,98,000",
    change: "+18.5%",
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Paid Users",
    value: "3,956",
    change: "+8.4%",
    icon: Users,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
]

export default function AdminRevenuePage() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Track revenue and subscription metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
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
                  <p className="mt-1 flex items-center gap-1 text-sm text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    {stat.change}
                  </p>
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
          <CardTitle>Revenue by Payment Method</CardTitle>
          <CardDescription>Stripe vs Razorpay monthly revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              stripe: { label: "Stripe", color: "#635BFF" },
              razorpay: { label: "Razorpay", color: "#2D8CFF" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="stripe" fill="#635BFF" radius={[4, 4, 0, 0]} name="Stripe ($)" />
                <Bar dataKey="razorpay" fill="#2D8CFF" radius={[4, 4, 0, 0]} name="Razorpay ($)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Users by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ChartContainer
                config={{
                  free: { label: "Free", color: "#6b7280" },
                  pro: { label: "Pro", color: "#4ade80" },
                  business: { label: "Business", color: "#a855f7" },
                }}
                className="h-[200px] w-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex-1 space-y-4">
                {planDistribution.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: plan.color }}
                      />
                      <span className="text-sm text-foreground">{plan.name}</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {plan.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest subscription payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.plan} - {tx.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
