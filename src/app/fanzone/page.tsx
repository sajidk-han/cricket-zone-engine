"use client"

import React from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/shared/components/LogoIcon'
import { Search, Trophy, ArrowRight } from 'lucide-react'

export default function FanZoneHubPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1b2559] bg-[#111c44]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoIcon size={32} />
            <span className="font-black text-white text-xl tracking-tighter">CricketZone</span>
          </Link>
          <Link href="/login" className="text-sm font-semibold text-[#a3aed1] hover:text-white transition-colors">
            Organizer Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-brand-primary/10">
          <Trophy size={32} className="text-brand-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-center tracking-tighter">
          Global <span className="text-brand-primary">Fan Zone</span>
        </h1>
        <p className="text-text-secondary text-center max-w-2xl mb-12 text-lg">
          Search for your local cricket club, academy, or district association to follow live matches, leaderboards, and tournament standings.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative mb-16">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-text-muted" size={24} />
          </div>
          <input
            type="text"
            placeholder="Enter Organization Name or Slug (e.g., peshawar-club)"
            className="w-full bg-[#111c44] border border-[#1b2559] text-white rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = e.currentTarget.value.trim().toLowerCase().replace(/\s+/g, '-');
                if (val) window.location.href = `/fanzone/${val}`;
              }
            }}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button 
              className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-primary/80 transition-colors"
              onClick={(e) => {
                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                const val = input?.value.trim().toLowerCase().replace(/\s+/g, '-');
                if (val) window.location.href = `/fanzone/${val}`;
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured / Demo Orgs */}
        <div className="w-full max-w-2xl">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-[#1b2559] pb-2">
            Featured Tournaments
          </h2>
          <div className="grid gap-4">
            <Link href="/fanzone/peshawar-club" className="group bg-[#111c44] border border-[#1b2559] hover:border-brand-primary/50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-lg hover:shadow-brand-primary/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                  <LogoIcon size={32} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-brand-primary transition-colors">Peshawar Cricket Club</h3>
                  <p className="text-sm text-text-muted">3 Active Tournaments • Live Now</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1b2559] flex items-center justify-center group-hover:bg-brand-primary text-[#a3aed1] group-hover:text-white transition-colors">
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link href="/fanzone/lahore-qalandars-academy" className="group bg-[#111c44] border border-[#1b2559] hover:border-brand-primary/50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-lg hover:shadow-brand-primary/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                  <LogoIcon size={32} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-brand-primary transition-colors">Lahore Qalandars Academy</h3>
                  <p className="text-sm text-text-muted">High Performance Center</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1b2559] flex items-center justify-center group-hover:bg-brand-primary text-[#a3aed1] group-hover:text-white transition-colors">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
