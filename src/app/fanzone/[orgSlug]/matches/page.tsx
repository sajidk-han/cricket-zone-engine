import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import MatchCard from '@/features/match-engine/components/MatchCard'
import { Calendar, Search } from 'lucide-react'

export const revalidate = 60

async function fetchAllMatches(orgSlug: string) {
  const supabase = await createClient()
  
  // 1. Get org id
  const { data: org } = await supabase.from('organizations').select('id').eq('slug', orgSlug).single()
  if (!org) return []

  // 2. Fetch matches
  const { data } = await supabase
    .from('matches')
    .select(`
      id, slug, status, team1_id, team2_id, match_winner_id,
      total_runs, total_wickets, overs_bowled, team2_runs, team2_wickets, team2_overs_bowled,
      scheduled_time, start_time, ground_name, match_stage,
      team1:teams!matches_team1_id_fkey(id, name, short_name, logo_url),
      team2:teams!matches_team2_id_fkey(id, name, short_name, logo_url),
      tournament:tournaments(id, name, slug)
    `)
    .eq('org_id', org.id)
    .order('scheduled_time', { ascending: false })

  if (!data) return []

  // Map to the shape expected by MatchCard
  return (data as any[]).map(m => ({
    ...m,
    team1_name: m.team1?.name,
    team1_short_name: m.team1?.short_name,
    team1_logo: m.team1?.logo_url,
    team2_name: m.team2?.name,
    team2_short_name: m.team2?.short_name,
    team2_logo: m.team2?.logo_url,
    tournament_name: m.tournament?.name
  }))
}

export default async function PublicMatches({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const matches = await fetchAllMatches(orgSlug)

  const live = matches.filter(m => m.status === 'live' || m.status === 'toss' || m.status === 'playing_xi')
  const scheduled = matches.filter(m => m.status === 'scheduled')
  const completed = matches.filter(m => m.status === 'completed' || m.status === 'abandoned' || m.status === 'cancelled')

  return (
    <div className="min-h-screen font-sans space-y-12 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-elevated border border-border-dim text-xs font-bold tracking-widest text-text-secondary uppercase mb-2">
          <Calendar size={14} className="text-brand-primary" />
          All Fixtures & Results
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase">
          Match <span className="text-brand-primary">Center</span>
        </h1>
      </div>

      {live.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-border-dim pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-status-danger animate-pulse" />
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {live.map(match => (
              <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                <MatchCard match={match} isLive={true} variant="standard" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {scheduled.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-border-dim pb-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Upcoming Fixtures</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduled.map(match => (
              <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                <MatchCard match={match} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-border-dim pb-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Recent Results</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completed.map(match => (
              <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                <MatchCard match={match} variant="horizontal" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-32 border border-border-dim rounded-[var(--radius-xl)] bg-bg-surface flex flex-col items-center gap-4">
          <Search size={48} className="text-text-muted/30" />
          <h3 className="text-xl font-bold text-text-secondary">No Matches Found</h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto">There are no matches scheduled or completed for this organization yet.</p>
        </div>
      )}

    </div>
  )
}
