"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Crown, CreditCard, Banknote } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Checkout } from "@/components/checkout"
import { SUBSCRIPTION_PLANS, formatPrice, formatPriceINR } from "@/lib/products"

export default function BillingPage() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay">("stripe")
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const filteredPlans = SUBSCRIPTION_PLANS.filter(
    (plan) => plan.interval === billingInterval && plan.id !== "trial" && plan.id !== "free"
  )

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Crown className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {user?.plan === "free"
                    ? "Free Plan"
                    : user?.plan === "pro"
                      ? "Pro Plan"
                      : "Business Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === "free"
                    ? "Limited features"
                    : "Full access to all features"}
                </p>
              </div>
            </div>
            {user?.plan !== "free" && (
              <Badge variant="outline" className="text-accent border-accent">
                Active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Free Trial */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-accent" />
            7-Day Free Trial
          </CardTitle>
          <CardDescription>
            Try all Pro features for just ₹1 (one-time charge)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Trial includes:</h4>
              <ul className="space-y-2">
                {[
                  "Unlimited links",
                  "Advanced analytics",
                  "20+ premium themes",
                  "Custom colors & fonts",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 shrink-0 text-accent mt-1" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">₹1</p>
                <p className="text-sm text-muted-foreground">One-time charge</p>
                <p className="text-xs text-muted-foreground mt-2">
                  After 7 days, upgrade to Pro or continue with Free plan
                </p>
              </div>
              <Button
                className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => handleSelectPlan("trial")}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Choose the plan that fits your needs
              </CardDescription>
            </div>
            <Tabs
              value={billingInterval}
              onValueChange={(v) => setBillingInterval(v as "month" | "year")}
            >
              <TabsList>
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="year">
                  Yearly
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-accent/10 text-accent"
                  >
                    Save 20%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan - always shown */}
            <div className="relative overflow-hidden rounded-xl border-2 border-border p-6 transition-all">
              <h3 className="text-xl font-semibold text-foreground">Free</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started with Ayush
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  "Up to 5 links",
                  "Basic analytics",
                  "5 default themes",
                  "Basic customization",
                  "Email support",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                disabled={user?.plan === "free"}
                className="mt-6 w-full"
                variant={user?.plan === "free" ? "outline" : "default"}
              >
                {user?.plan === "free" ? "Current Plan" : "Get Started"}
              </Button>
            </div>

            {filteredPlans.map((plan) => {
              const isPro = plan.id.startsWith("pro")
              const isCurrent =
                (user?.plan === "pro" && isPro) ||
                (user?.plan === "business" && !isPro)

              return (
                <div
                  key={plan.id}
                  className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all ${
                    plan.popular
                      ? "border-accent bg-accent/5"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-foreground">
                    {isPro ? "Pro" : "Business"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(plan.priceInCents)}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                  {plan.priceInINR && (
                    <p className="text-sm text-muted-foreground">
                      or {formatPriceINR(plan.priceInINR)}/{plan.interval}
                    </p>
                  )}

                  <ul className="mt-6 space-y-3">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-accent" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.features.length > 5 && (
                      <li className="text-sm text-muted-foreground">
                        +{plan.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`mt-6 w-full ${
                      plan.popular
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("stripe")}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                paymentMethod === "stripe"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#635BFF]/10">
                <CreditCard className="h-6 w-6 text-[#635BFF]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Stripe</p>
                <p className="text-sm text-muted-foreground">
                  Credit/Debit Cards, Apple Pay, Google Pay
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("razorpay")}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                paymentMethod === "razorpay"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2D8CFF]/10">
                <Banknote className="h-6 w-6 text-[#2D8CFF]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Razorpay</p>
                <p className="text-sm text-muted-foreground">
                  UPI, Net Banking, Wallets (India)
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
          </DialogHeader>
          {selectedPlan && paymentMethod === "stripe" && (
            <Checkout productId={selectedPlan} />
          )}
          {selectedPlan && paymentMethod === "razorpay" && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Razorpay checkout will open in a new window.
              </p>
              <Button
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  // In production, this would trigger Razorpay checkout
                  alert("Razorpay integration - configure with your API keys")
                }}
              >
                Pay with Razorpay
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
