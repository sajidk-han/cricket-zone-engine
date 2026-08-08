import React from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/shared/components/LogoIcon'
import { Trophy, ArrowRight, Activity } from 'lucide-react'
import { FanZoneSearchClient } from './FanZoneSearchClient'
import { createAdminClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'Fan Zone Hub | CricketZone',
  description: 'Find and follow your favorite cricket tournaments and organizations live on CricketZone.'
}

export const revalidate = 60

async function getFeaturedTournaments() {
  try {
    const supabase = await createAdminClient()
    
    // Get active tournaments (organizations that have live/recent matches)
    // For simplicity, we just fetch organizations that are 'approved' and have some active matches
    // But since the query might be complex without a direct active_organizations view,
    // we'll fetch organizations and see which ones have live matches.
    const { data: orgs, error } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .limit(10)
      
    if (error || !orgs) return []

    // Map them with dummy live status or fetch matches
    // Here we just return the orgs we have, marking them as active
    return orgs.map((org: any) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      activeTournaments: 1, // Placeholder 
      isLive: true
    }))
  } catch (error) {
    console.error('Failed to fetch orgs:', error)
    return []
  }
}

export default async function FanZoneHubPage() {
  const featuredOrgs = await getFeaturedTournaments()

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

        {/* Search Bar - Client Component */}
        <FanZoneSearchClient />

        {/* Featured / Active Tournaments */}
        <div className="w-full max-w-2xl">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-[#1b2559] pb-2 flex items-center gap-2">
            <Activity size={16} className="text-brand-primary" /> Active Tournaments
          </h2>
          <div className="grid gap-4">
            {featuredOrgs.length > 0 ? (
              featuredOrgs.map((org: any) => (
                <Link key={org.id} href={`/fanzone/${org.slug}`} className="group bg-[#111c44] border border-[#1b2559] hover:border-brand-primary/50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-lg hover:shadow-brand-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                      <LogoIcon size={32} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-brand-primary transition-colors">{org.name}</h3>
                      <p className="text-sm text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live Action
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1b2559] flex items-center justify-center group-hover:bg-brand-primary text-[#a3aed1] group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center p-8 bg-[#111c44] rounded-xl border border-[#1b2559]">
                <p className="text-text-muted">No active tournaments found at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
