import React from 'react' // Force Landing Page HMR
import { LandingNavbar } from '@/features/landing/components/sections/Navbar'
import { HeroSection } from '@/features/landing/components/sections/HeroSection'
import { TrustSection } from '@/features/landing/components/sections/TrustSection'
import { ProductCarouselSection } from '@/features/landing/components/sections/ProductCarouselSection'
import { StatsSection } from '@/features/landing/components/sections/StatsSection'
import { FeaturesSection } from '@/features/landing/components/sections/FeaturesSection'
import { FanZoneSection } from '@/features/landing/components/sections/FanZoneSection'
import { PlatformSection } from '@/features/landing/components/sections/PlatformSection'
import { SecuritySection } from '@/features/landing/components/sections/SecuritySection'
import { ComparisonSection } from '@/features/landing/components/sections/ComparisonSection'
import { TestimonialsSection } from '@/features/landing/components/sections/TestimonialsSection'
import { FAQSection } from '@/features/landing/components/sections/FAQSection'
import { CTASection } from '@/features/landing/components/sections/CTASection'
import { Footer } from '@/features/landing/components/sections/Footer'

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .force-dark {
          --bg-base: #050814 !important;
          --bg-surface: #111c44 !important;
          --bg-elevated: #1b2559 !important;
          --text-primary: #ffffff !important;
          --text-secondary: #a3aed1 !important;
          --text-muted: #8f9bba !important;
          --border-dim: #1b2559 !important;
          --border-strong: #2b3674 !important;
        }
      `}} />
      <div className="force-dark dark min-h-screen bg-[#050814] text-white selection:bg-brand-primary/30 font-sans overflow-x-hidden flex flex-col">
      <LandingNavbar />
      
      <main>
        <HeroSection />
        <div className="hidden md:block">
          <TrustSection />
          <ProductCarouselSection />
          <StatsSection />
          <FeaturesSection />
          <ComparisonSection />
          <SecuritySection />
          <FanZoneSection />
          <PlatformSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </div>
      </main>

      <Footer />
      </div>
    </>
  )
}
