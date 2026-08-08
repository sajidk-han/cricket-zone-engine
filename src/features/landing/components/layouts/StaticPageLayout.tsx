import React from 'react'
import { LandingNavbar } from '@/features/landing/components/sections/Navbar'
import { Footer } from '@/features/landing/components/sections/Footer'

export function StaticPageLayout({ 
  children, 
  title, 
  subtitle 
}: { 
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-text-primary selection:bg-brand-primary/30 font-sans overflow-x-hidden flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="pt-32 pb-16 px-6 lg:px-12 bg-gradient-to-b from-bg-surface/50 to-transparent border-b border-bg-elevated/50 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">{title}</h1>
          {subtitle && <p className="text-lg text-text-secondary max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <div className="prose prose-invert prose-brand max-w-none text-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
