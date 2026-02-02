"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const templates = [
  {
    name: "Creator",
    description: "Perfect for content creators and influencers",
    theme: "from-pink-500 to-rose-500",
    preview: {
      avatar: "C",
      username: "@creator",
      links: ["YouTube", "Instagram", "Merch Store"],
    },
  },
  {
    name: "Business",
    description: "Professional layout for companies",
    theme: "from-blue-500 to-indigo-500",
    preview: {
      avatar: "B",
      username: "@business",
      links: ["Book a Call", "Services", "Portfolio"],
    },
  },
  {
    name: "Musician",
    description: "Showcase your music and events",
    theme: "from-purple-500 to-violet-500",
    preview: {
      avatar: "M",
      username: "@musician",
      links: ["Spotify", "Apple Music", "Tour Dates"],
    },
  },
  {
    name: "Minimal",
    description: "Clean and simple design",
    theme: "from-neutral-600 to-neutral-700",
    preview: {
      avatar: "M",
      username: "@minimal",
      links: ["Website", "Contact", "About"],
    },
  },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Free templates to get started
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Choose from our collection of professionally designed templates.
            </p>
          </div>
          <Link href="/templates">
            <Button variant="outline" className="gap-2 bg-transparent">
              View All Templates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-accent/50 hover:shadow-xl"
            >
              {/* Template preview */}
              <div className={`bg-gradient-to-br ${template.theme} p-6`}>
                <div className="mx-auto flex w-full max-w-[160px] flex-col items-center rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    {template.preview.avatar}
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">
                    {template.preview.username}
                  </p>
                  <div className="mt-4 w-full space-y-2">
                    {template.preview.links.map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="rounded-lg bg-white/20 px-3 py-2 text-center text-xs font-medium text-white"
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Template info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{template.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
