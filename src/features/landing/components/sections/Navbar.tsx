"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { LogoIcon } from '@/shared/components/LogoIcon'
import { Menu, X } from 'lucide-react'

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#111c44]/80 backdrop-blur-lg border-b border-[#1b2559] py-4 shadow-sm shadow-black/50' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <LogoIcon size={36} className="transition-transform group-hover:scale-110 duration-300" />
          <span className="text-2xl font-black text-white tracking-tighter">CricketZone</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-semibold text-[#a3aed1] hover:text-white transition-colors">Features</Link>
          <Link href="#fanzone" className="text-sm font-semibold text-[#a3aed1] hover:text-white transition-colors">Fan Zone</Link>
          <Link href="#pricing" className="text-sm font-semibold text-[#a3aed1] hover:text-white transition-colors">Pricing</Link>
          <Link href="/docs" className="text-sm font-semibold text-[#a3aed1] hover:text-white transition-colors">Documentation</Link>
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#a3aed1] hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register">
            <Button variant="primary" className="rounded-full px-6 font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-shadow">
              Start a Tournament
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[#a3aed1] hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#111c44]/95 backdrop-blur-xl border-b border-[#1b2559] p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Features</Link>
          <Link href="#fanzone" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Fan Zone</Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Pricing</Link>
          <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white">Documentation</Link>
          <div className="h-px bg-[#1b2559] w-full my-2"></div>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-white">Login</Link>
          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="primary" className="w-full rounded-xl py-6 text-lg font-bold">
              Start a Tournament
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
