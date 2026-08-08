import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import MatchCard from '@/features/match-engine/components/MatchCard'
import { PlayCircle, CalendarDays } from 'lucide-react'

// Fetch matches from our newly created optimized view
async function fetchPublicMatches() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('live_match_view')
    .select('*')
    .order('scheduled_time', { ascending: true })

  if (error) {
    console.error('Error fetching public matches:', error)
    return []
  }
  return data || []
}

export default async function PublicLiveFeed({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const matches = await fetchPublicMatches()

  const liveMatches = matches.filter(m => m.status === 'live' || m.status === 'toss' || m.status === 'playing_xi')
  const upcomingMatches = matches.filter(m => m.status === 'scheduled')
  const completedMatches = matches.filter(m => m.status === 'completed')

  const heroMatch = liveMatches.length > 0 ? liveMatches[0] : (upcomingMatches.length > 0 ? upcomingMatches[0] : null)
  const remainingLive = liveMatches.length > 0 ? liveMatches.slice(1) : []

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-elevated border border-border-dim text-xs font-bold tracking-widest text-text-secondary uppercase mb-2">
            <PlayCircle size={14} className="text-status-danger" />
            Live Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase">
            Match <span className="text-brand-primary">Action</span>
          </h1>
        </div>

        {/* Hero Match Section */}
        {heroMatch && (
          <section className="mb-12">
            <Link href={`/fanzone/${orgSlug}/matches/${heroMatch.id}`} className="block group">
              <MatchCard match={heroMatch} isLive={heroMatch.status === 'live'} variant="hero" />
            </Link>
          </section>
        )}

        {/* Other Live Matches */}
        {remainingLive.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6 border-b border-border-dim pb-4">
              <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Also Live</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingLive.map((match: any) => (
                <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                  <MatchCard match={match} isLive={true} variant="standard" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches Section */}
        {upcomingMatches.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6 border-b border-border-dim pb-4">
              <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Upcoming Fixtures</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingMatches.filter(m => m.id !== heroMatch?.id).map((match: any) => (
                <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                  <MatchCard match={match} isLive={false} variant="compact" />
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {matches.length === 0 && (
          <div className="text-center py-32 border border-border-dim rounded-[var(--radius-xl)] bg-bg-surface flex flex-col items-center gap-4">
            <CalendarDays size={48} className="text-text-muted/30" />
            <h3 className="text-xl font-bold text-text-secondary">No Matches Right Now</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto">There are no live or upcoming matches scheduled for this organization at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}


