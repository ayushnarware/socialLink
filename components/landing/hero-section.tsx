"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { HeroScene } from "./hero-scene"
import { useAuth } from "@/hooks/use-auth"

export function HeroSection() {
  const { isAuthenticated, isLoading } = useAuth()

  const primaryHref = !isLoading && isAuthenticated ? "/dashboard" : "/signup"
  const primaryLabel = !isLoading && isAuthenticated ? "Go to Dashboard" : "Get Started Free"

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      <HeroScene />
      
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          New: AI-powered link optimization
        </div>
        
        <h1 className="mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Your entire online presence in{" "}
          <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
            one link
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Create stunning link-in-bio pages, track analytics, and grow your audience. 
          The complete platform for creators and businesses.
        </p>
        
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href={primaryHref}>
            <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2 bg-transparent">
            <Play className="h-4 w-4" />
            Watch Demo
          </Button>
        </div>
        
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">2M+</p>
            <p className="text-sm">Active Users</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">50M+</p>
            <p className="text-sm">Links Created</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">99.9%</p>
            <p className="text-sm">Uptime</p>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
