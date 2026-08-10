import React from 'react'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import MatchCard from '@/features/match-engine/components/MatchCard'
import { PlayCircle, CalendarDays } from 'lucide-react'

// Fetch matches directly from matches table to avoid view dependency issues
async function fetchPublicMatches(orgSlug: string) {
  const supabase = await createAdminClient()
  
  // Get org id
  const { data: org } = await supabase.from('organizations').select('id').eq('slug', orgSlug).single()
  if (!org) return []

  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, slug, status, team1_id, team2_id, winning_team_id,
      scheduled_time, start_time, match_stage,
      team1:teams!matches_team1_id_fkey!inner(id, name, short_name, logo_url),
      team2:teams!matches_team2_id_fkey!inner(id, name, short_name, logo_url),
      tournament:tournaments(id, name, slug),
      innings(innings_number, batting_team_id, total_runs, total_wickets, overs_bowled)
    `)
    .eq('org_id', org.id)
    .is('deleted_at', null)
    .is('team1.deleted_at', null)
    .is('team2.deleted_at', null)
    .order('scheduled_time', { ascending: true })

  if (error) {
    console.error('Error fetching public matches:', JSON.stringify(error))
    return []
  }
  
  return (data || []).map((m: any) => {
    const inn1 = m.innings?.find((i: any) => i.batting_team_id === m.team1_id)
    const inn2 = m.innings?.find((i: any) => i.batting_team_id === m.team2_id)
    
    return {
      ...m,
      total_runs: inn1?.total_runs || 0,
      total_wickets: inn1?.total_wickets || 0,
      overs_bowled: inn1?.overs_bowled || 0,
      team2_runs: inn2?.total_runs || 0,
      team2_wickets: inn2?.total_wickets || 0,
      team2_overs_bowled: inn2?.overs_bowled || 0,
      team1_name: m.team1?.name,
      team1_short_name: m.team1?.short_name,
      team1_logo: m.team1?.logo_url,
      team2_name: m.team2?.name,
      team2_short_name: m.team2?.short_name,
      team2_logo: m.team2?.logo_url,
      tournament_name: m.tournament?.name
    }
  })
}

export default async function PublicLiveFeed({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const matches = await fetchPublicMatches(orgSlug)

  const liveMatches = matches.filter((m: any) => m.status === 'live' || m.status === 'toss' || m.status === 'playing_xi')
  const upcomingMatches = matches.filter((m: any) => m.status === 'scheduled')
  const completedMatches = matches.filter((m: any) => m.status === 'completed')

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
              {upcomingMatches.filter((m: any) => m.id !== heroMatch?.id).map((match: any) => (
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


