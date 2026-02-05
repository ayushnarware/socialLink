"use client"

import React, { createContext, useContext, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Loader2 } from "lucide-react"

const SidebarContext = createContext<{ isOpen: boolean; toggle: () => void; close: () => void } | null>(null)
export function useSidebarContext() {
  const ctx = useContext(SidebarContext)
  return ctx || { isOpen: false, toggle: () => {}, close: () => {} }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <SidebarContext.Provider value={{ isOpen: sidebarOpen, toggle: () => setSidebarOpen((s) => !s), close: () => setSidebarOpen(false) }}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar user={user} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
          <DashboardHeader user={user} />
          <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
