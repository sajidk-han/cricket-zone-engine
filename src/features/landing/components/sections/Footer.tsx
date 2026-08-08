import React from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/shared/components/LogoIcon'
import { Button } from '@/shared/components/ui/Button'
import { ArrowRight, Activity } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1b2559] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <LogoIcon size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-xl font-black text-white tracking-tighter">CricketZone</span>
            </Link>
            <p className="text-sm text-[#8f9bba] mb-8 leading-relaxed max-w-sm">
              The premium enterprise platform for modern cricket organizations. Digitize your league, manage tournaments, and engage fans globally.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-widest">Subscribe to Updates</h4>
              <div className="flex items-center gap-2 max-w-sm">
                <input type="email" placeholder="Enter your email" className="bg-[#111c44] border border-[#1b2559] rounded-lg px-4 py-2.5 text-sm flex-1 text-white focus:outline-none focus:border-brand-primary" />
                <Button variant="primary" className="rounded-lg px-4 py-2.5 shadow-md">
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4 text-sm text-[#a3aed1]">
              <li><Link href="#features" className="hover:text-brand-primary transition-colors">Features</Link></li>
              <li><Link href="/public" className="hover:text-brand-primary transition-colors">Fan Zone</Link></li>
              <li><Link href="#pricing" className="hover:text-brand-primary transition-colors flex items-center gap-2">Pricing <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary uppercase font-bold tracking-wider">Soon</span></Link></li>
              <li><Link href="/register" className="hover:text-brand-primary transition-colors">Organizations</Link></li>
              <li><Link href="/downloads" className="hover:text-brand-primary transition-colors">Mobile App</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-sm text-[#a3aed1]">
              <li><Link href="/docs" className="hover:text-brand-primary transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-brand-primary transition-colors">API Reference</Link></li>
              <li><Link href="/blog" className="hover:text-brand-primary transition-colors">Blog</Link></li>
              <li><Link href="/support" className="hover:text-brand-primary transition-colors">Help Center</Link></li>
              <li><Link href="/case-studies" className="hover:text-brand-primary transition-colors">Case Studies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm text-[#a3aed1]">
              <li><Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-brand-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
              <li><Link href="/partners" className="hover:text-brand-primary transition-colors">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-[#a3aed1]">
              <li><Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-brand-primary transition-colors">Security</Link></li>
              <li><Link href="/gdpr" className="hover:text-brand-primary transition-colors">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1b2559] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <p className="text-xs text-[#8f9bba]">
              © {new Date().getFullYear()} CricketZone Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium hover:text-emerald-400 transition-colors cursor-pointer">
               <Activity size={12} className="animate-pulse" /> All systems normal
            </div>
          </div>
          
          <div className="flex gap-4">
             <a href="#" className="w-8 h-8 rounded-full bg-[#1b2559] flex items-center justify-center text-[#8f9bba] hover:bg-brand-primary hover:text-white transition-colors">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
             </a>
             <a href="#" className="w-8 h-8 rounded-full bg-[#1b2559] flex items-center justify-center text-[#8f9bba] hover:bg-brand-primary hover:text-white transition-colors">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
             </a>
             <a href="#" className="w-8 h-8 rounded-full bg-[#1b2559] flex items-center justify-center text-[#8f9bba] hover:bg-brand-primary hover:text-white transition-colors">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
             </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
