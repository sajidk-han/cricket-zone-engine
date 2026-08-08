import React from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      
      {/* Background container */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-brand-primary/10 to-[#09090b]"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
        
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 max-w-3xl mx-auto">
          Ready to Digitize Your Cricket Tournaments?
        </h2>
        <p className="text-lg text-[#a3aed1] max-w-2xl mx-auto mb-10 leading-relaxed">
          Join hundreds of other leagues, academies, and clubs already running their matches on the world's most advanced cricket platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/register">
            <Button variant="primary" className="rounded-full px-8 py-6 text-base font-bold w-full sm:w-auto shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-shadow">
              Start a Tournament <ArrowRight size={18} className="inline ml-2" />
            </Button>
          </Link>
          <Link href="/public" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-full px-10 py-6 text-lg font-bold bg-[#111c44] hover:bg-[#1b2559] border-[#1b2559] text-white">
              Explore Fan Zone
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
