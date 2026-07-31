import React from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Trophy, PlayCircle, Shield, TrendingUp } from 'lucide-react'

export default function PublicPortal() {
  return (
    <div className="min-h-screen bg-[#09090b] text-text-primary selection:bg-brand-primary/30">
      
      {/* Navbar */}
      <nav className="h-20 border-b border-bg-elevated bg-bg-surface/50 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏏</span>
          <span className="text-2xl font-black text-white tracking-tighter">CricketZone</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-text-secondary hover:text-white transition-colors">
            Organizer Login
          </Link>
          <Link href="/login">
            <Button variant="primary" className="rounded-full px-6">Follow Team</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold uppercase tracking-wider mb-4 animate-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            Live Now: Super League Finals
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] animate-in slide-in-from-bottom-4 duration-500">
            The Home of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Amateur Cricket.</span>
          </h1>
          <p className="text-xl text-text-secondary animate-in slide-in-from-bottom-6 duration-700">
            Follow your favorite local teams, track live ball-by-ball scoring, and analyze player statistics in real-time.
          </p>
        </div>

        {/* Live Match Card */}
        <div className="max-w-4xl mx-auto relative animate-in zoom-in-95 duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-[2rem] blur opacity-20"></div>
          <Card className="relative bg-bg-surface/80 backdrop-blur-xl border-bg-elevated rounded-[2rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-10 flex flex-col justify-center gap-8">
                  <div className="flex justify-between items-center text-sm font-bold tracking-wider uppercase text-text-secondary">
                    <span>T20 Final</span>
                    <span className="text-brand-primary flex items-center gap-1"><PlayCircle size={16}/> Inings Break</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bg-elevated rounded-xl flex items-center justify-center text-xl">🦅</div>
                        <span className="text-2xl font-bold text-white">Eagles CC</span>
                      </div>
                      <span className="text-3xl font-black tabular-nums">185<span className="text-lg text-text-secondary">/4</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bg-elevated rounded-xl flex items-center justify-center text-xl">🐅</div>
                        <span className="text-2xl font-bold text-text-muted">Tigers XI</span>
                      </div>
                      <span className="text-3xl font-black tabular-nums text-text-muted">Yet to bat</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-bg-elevated flex justify-between items-center">
                    <p className="text-text-secondary text-sm">Tigers XI need 186 runs to win from 20 overs.</p>
                    <Button variant="primary" className="rounded-full">Match Center</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-bg-surface border border-bg-elevated hover:border-brand-primary/30 transition-colors">
            <Trophy size={32} className="text-brand-primary mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Ongoing Tournaments</h3>
            <p className="text-text-secondary">Discover leagues and tournaments happening near you.</p>
          </div>
          <div className="p-8 rounded-3xl bg-bg-surface border border-bg-elevated hover:border-brand-secondary/30 transition-colors">
            <Shield size={32} className="text-brand-secondary mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Team Rankings</h3>
            <p className="text-text-secondary">See how your club stacks up against the competition.</p>
          </div>
          <div className="p-8 rounded-3xl bg-bg-surface border border-bg-elevated hover:border-blue-500/30 transition-colors">
            <TrendingUp size={32} className="text-blue-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Player Stats</h3>
            <p className="text-text-secondary">Deep dive into career averages and match performances.</p>
          </div>
        </div>
      </main>

    </div>
  )
}

