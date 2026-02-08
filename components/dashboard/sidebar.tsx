"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthUser } from "@/hooks/use-auth"
import {
  Link2,
  Palette,
  Search,
  QrCode,
  Globe,
  CreditCard,
  BarChart3,
  Settings,
  Crown,
  X,
  FileText,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Links", icon: Link2 },
  { href: "/dashboard/design", label: "Design", icon: Palette },
  { href: "/dashboard/seo", label: "SEO", icon: Search },
  { href: "/dashboard/qr", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/domains", label: "Domains", icon: Globe },
  { href: "/dashboard/links-files-forms", label: "Links & Forms", icon: FileText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

interface DashboardSidebarProps {
  user: AuthUser
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function DashboardSidebar({
  user,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="font-bold text-accent-foreground">MP</span>
            </div>
            <span className="text-xl font-bold text-foreground">MyProfile.live</span>
          </Link>
          <button
            type="button"
            className="lg:hidden"
            onClick={onMobileClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

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
                onClick={onMobileClose}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Upgrade card */}
        {user.plan === "free" && (
          <div className="m-4 rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-foreground">Upgrade to Pro</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Unlock unlimited links, custom domains, and advanced analytics.
            </p>
            <Link href="/dashboard/billing">
              <Button
                size="sm"
                className="mt-3 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Upgrade Now
              </Button>
            </Link>
          </div>
        )}

        {/* User info */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}
