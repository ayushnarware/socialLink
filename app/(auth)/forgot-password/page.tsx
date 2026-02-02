"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send reset email")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Check your email</h1>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              The link will expire in 24 hours. If you don't see the email, check your spam
              folder or try again.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </Button>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
