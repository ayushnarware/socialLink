"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 5 links",
      "Basic analytics",
      "Standard themes",
      "QR code generator",
      "Ayush branding",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For creators who want more",
    features: [
      "Unlimited links",
      "Advanced analytics",
      "20+ premium themes",
      "Custom colors & fonts",
      "Remove Ayush branding",
      "Priority support",
      "SEO optimization",
      "Animated backgrounds",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "per month",
    description: "For teams and businesses",
    features: [
      "Everything in Pro",
      "Custom domain",
      "API access",
      "Team collaboration",
      "White-label solution",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl border ${
                plan.popular
                  ? "border-accent bg-card shadow-xl shadow-accent/10"
                  : "border-border/50 bg-card/50"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-xl bg-accent px-4 py-1 text-xs font-medium text-accent-foreground">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/signup" className="mt-8 block">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include SSL, 99.9% uptime, and 24/7 monitoring.
            <br />
            Payment methods: Credit Card, UPI, Net Banking, Wallets
          </p>
        </div>
      </div>
    </section>
  )
}
