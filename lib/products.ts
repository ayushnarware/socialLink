export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  priceInINR?: number
  interval: "month" | "year" | "trial"
  features: string[]
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: Product[] = [
  {
    id: "trial",
    name: "7-Day Free Trial",
    description: "Try Pro features for 7 days",
    priceInCents: 1, // 1 Rupee = ~0.01 USD, but we'll charge 1 cent/paise
    priceInINR: 1, // 1 Rupee one-time charge
    interval: "trial",
    features: [
      "Unlimited links",
      "Advanced analytics",
      "20+ premium themes",
      "Custom colors & fonts",
      "7-day trial period",
      "Upgrade anytime",
      "No credit card required after trial",
    ],
    popular: false,
  },
  {
    id: "free",
    name: "Free",
    description: "Get started for free",
    priceInCents: 0,
    priceInINR: 0,
    interval: "month",
    features: [
      "Up to 5 links",
      "Basic analytics",
      "5 default themes",
      "Basic customization",
      "MyProfile.live branding",
      "Email support",
      "Standard links & files",
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    description: "For creators who want more",
    priceInCents: 900, // $9/month
    priceInINR: 499, // ₹499/month
    interval: "month",
    features: [
      "Unlimited links",
      "Advanced analytics",
      "20+ premium themes",
      "Custom colors & fonts",
      "Remove MyProfile.live branding",
      "Priority support",
      "SEO optimization",
      "Animated backgrounds",
    ],
    popular: true,
  },
  {
    id: "pro-yearly",
    name: "Pro Yearly",
    description: "For creators who want more - save 20%",
    priceInCents: 8640, // $86.40/year ($7.20/month)
    priceInINR: 4788, // ₹4788/year (₹399/month)
    interval: "year",
    features: [
      "Unlimited links",
      "Advanced analytics",
      "20+ premium themes",
      "Custom colors & fonts",
      "Remove MyProfile.live branding",
      "Priority support",
      "SEO optimization",
      "Animated backgrounds",
    ],
    popular: false,
  },
  {
    id: "business-monthly",
    name: "Business Monthly",
    description: "For teams and businesses",
    priceInCents: 2900, // $29/month
    priceInINR: 1999, // ₹1999/month
    interval: "month",
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
  },
  {
    id: "business-yearly",
    name: "Business Yearly",
    description: "For teams and businesses - save 20%",
    priceInCents: 27840, // $278.40/year ($23.20/month)
    priceInINR: 19188, // ₹19188/year (₹1599/month)
    interval: "year",
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
  },
]

export function getProductById(id: string): Product | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export function formatPriceINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
