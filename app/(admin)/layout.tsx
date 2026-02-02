"use client"

import React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  BarChart3,
  Settings,
  Shield,
  LayoutDashboard,
  LogOut,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/admin/features", label: "Feature Toggles", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
            <Shield className="h-4 w-4 text-destructive-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full mb-2 bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
