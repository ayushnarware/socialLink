import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { PlatformsSection } from "@/components/landing/platforms-section"
import { TemplatesSection } from "@/components/landing/templates-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PlatformsSection />
      <TemplatesSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
