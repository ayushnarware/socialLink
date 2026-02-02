"use client"

import { 
  Link2, 
  Palette, 
  Share2, 
  BarChart3, 
  QrCode, 
  Globe,
  Sparkles,
  Shield,
  Zap
} from "lucide-react"

const features = [
  {
    icon: Link2,
    title: "Create",
    description: "Build beautiful link pages with drag-and-drop simplicity. Add buttons, cards, video embeds, and more.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Palette,
    title: "Customize",
    description: "Choose from 20+ themes, custom colors, fonts, and animated backgrounds. Make it uniquely yours.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Share2,
    title: "Share",
    description: "One link for all your content. Share across all platforms and reach your audience everywhere.",
    gradient: "from-orange-500 to-amber-600",
  },
]

const additionalFeatures = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track views, clicks, CTR, devices, locations, and referrers with beautiful charts.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Generate custom QR codes for each link. Track scans and download in multiple formats.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Connect your own domain for a professional, branded experience.",
  },
  {
    icon: Sparkles,
    title: "SEO Optimized",
    description: "Meta tags, Open Graph, sitemaps, and canonical URLs built-in.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with role-based access control.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Global CDN ensures your pages load instantly, anywhere in the world.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to grow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to help you build, manage, and optimize your online presence.
          </p>
        </div>
        
        {/* Main feature cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
        
        {/* Additional features grid */}
        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-border hover:bg-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
