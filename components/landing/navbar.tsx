"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#templates", label: "Templates" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="font-bold text-accent-foreground">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Ayush</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Start for Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Start for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
