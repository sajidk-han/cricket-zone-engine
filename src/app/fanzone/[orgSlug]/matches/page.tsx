import React from 'react'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import MatchCard from '@/features/match-engine/components/MatchCard'
import { Calendar, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function fetchAllMatches(orgSlug: string) {
  const supabase = await createAdminClient()
  
  // 1. Get org id
  const { data: org } = await supabase.from('organizations').select('id').eq('slug', orgSlug).single()
  if (!org) return []

  // 2. Fetch matches
  const { data } = await supabase
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
    .order('scheduled_time', { ascending: false })

  if (!data) return []

  // Map to the shape expected by MatchCard
  return (data as any[]).map((m: any) => {
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

export default async function PublicMatches({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const matches = await fetchAllMatches(orgSlug)

  const live = matches.filter(m => m.status === 'live' || m.status === 'toss' || m.status === 'playing_xi')
  const scheduled = matches.filter(m => m.status === 'scheduled')
  const completed = matches.filter(m => m.status === 'completed' || m.status === 'abandoned' || m.status === 'cancelled')
  const draft = matches.filter(m => m.status === 'draft')

  return (
    <div className="min-h-screen font-sans space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pt-4 md:pt-6">
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

      {draft.length > 0 && (
        <section className="opacity-70">
          <div className="flex items-center gap-2 mb-6 border-b border-border-dim pb-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Drafts (Not started yet)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draft.map(match => (
              <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                <MatchCard match={match} variant="compact" />
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
