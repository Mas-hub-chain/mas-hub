import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { IntegrationsSection } from "@/components/sections/integrations-section"
import { CTASection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/blockchain-illustration.png')] bg-no-repeat bg-right-top bg-contain opacity-5"></div>
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <IntegrationsSection />
          <CTASection />
        </main>
      </div>
    </div>
  )
}
