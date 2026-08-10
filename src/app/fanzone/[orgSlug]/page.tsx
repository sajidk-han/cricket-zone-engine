import React from 'react' // Force recompile for MatchCard
import Link from 'next/link'
import { getFeatureFlags } from '@/lib/feature-flags'
import MatchCard from '@/features/match-engine/components/MatchCard'
import { FeaturedTeamCard } from '@/features/fanzone/components/FeaturedTeamCard'
import { JsonLd, generateSportsEventSchema } from '@/features/fanzone/components/JsonLd'
import { ChevronRight, Activity, Calendar, Trophy, PlayCircle } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase-server'

// Allow ISR revalidation for the home page (every 60s)
export const revalidate = 60

async function getFanzoneData(orgSlug: string) {
  try {
    const supabase = await createAdminClient()

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('slug', orgSlug)
      .single()

    if (orgError || !org) return null

    const { data: liveMatches } = await supabase
      .from('matches')
      .select(`
        id, slug, status, team1_id, team2_id, winning_team_id,
        team1:teams!matches_team1_id_fkey!inner(id, name, short_name, logo_url),
        team2:teams!matches_team2_id_fkey!inner(id, name, short_name, logo_url),
        tournament:tournaments(id, name, slug),
        innings(innings_number, batting_team_id, total_runs, total_wickets, overs_bowled)
      `)
      .eq('org_id', org.id)
      .is('deleted_at', null)
      .is('team1.deleted_at', null)
      .is('team2.deleted_at', null)
      .in('status', ['live', 'scheduled', 'completed'])
      .order('status', { ascending: true })
      .limit(5)

    const { data: featuredTeams } = await supabase
      .from('teams')
      .select('id, name, short_name, slug, logo_url')
      .eq('org_id', org.id)
      .is('deleted_at', null)
      .limit(4)

    const { data: recentResults } = await supabase
      .from('matches')
      .select(`
        id, slug, status, result_reason, winning_team_id,
        team1:teams!matches_team1_id_fkey!inner(id, name, short_name, logo_url),
        team2:teams!matches_team2_id_fkey!inner(id, name, short_name, logo_url),
        winning_team:teams!matches_winning_team_id_fkey(id, name),
        tournament:tournaments(id, name, slug),
        innings(innings_number, batting_team_id, total_runs, total_wickets, overs_bowled)
      `)
      .eq('org_id', org.id)
      .is('deleted_at', null)
      .is('team1.deleted_at', null)
      .is('team2.deleted_at', null)
      .eq('status', 'completed')
      .order('end_time', { ascending: false })
      .limit(4)

    const mapMatchData = (m: any) => {
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
    }

    return {
      organization: org,
      liveMatches: (liveMatches || []).map(mapMatchData),
      featuredTeams: featuredTeams || [],
      recentResults: (recentResults || []).map(mapMatchData)
    }
  } catch (error) {
    console.error('Direct DB Error:', error)
    return null
  }
}

export default async function FanZoneHome({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  
  const data = await getFanzoneData(orgSlug)
  const flags = await getFeatureFlags()

  if (!data || !data.organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-bg-surface border border-border-dim rounded-[var(--radius-2xl)] m-6 p-12">
        <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tighter">Organization Not Found</h1>
        <p className="text-text-secondary">The requested FanZone does not exist.</p>
        <Link href="/" className="mt-8 text-brand-primary font-bold hover:underline">Return to Home</Link>
      </div>
    )
  }

  const { organization: org, liveMatches, featuredTeams, recentResults } = data
  const topMatch = liveMatches.length > 0 ? liveMatches[0] : null
  const otherLive = liveMatches.slice(1)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cricketzone.com'

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {topMatch && (
        <JsonLd data={generateSportsEventSchema(topMatch, `${appUrl}/fanzone/${orgSlug}`)} />
      )}

      {/* 1. HERO MATCH */}
      {topMatch && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border-dim pb-3">
            <PlayCircle size={18} className="text-status-danger" />
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Featured Live Match</h2>
          </div>
          <Link href={`/fanzone/${orgSlug}/matches/${topMatch.id}`} className="block">
            <MatchCard match={topMatch} isLive={true} variant="hero" />
          </Link>
        </section>
      )}

      {/* 2. OTHER LIVE MATCHES */}
      {otherLive.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-border-dim pb-3">
            <span className="w-2 h-2 rounded-full bg-status-danger animate-pulse" /> 
            <h2 className="text-base font-bold text-text-primary uppercase tracking-wider">Other Live Matches</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {otherLive.map((match: any) => (
              <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block">
                <MatchCard match={match} isLive={true} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. RECENT RESULTS & UPCOMING */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-border-dim pb-3">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Activity size={16} className="text-brand-primary" /> Recent Results
            </h2>
            <Link href={`/fanzone/${orgSlug}/matches`} className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentResults.length > 0 ? recentResults.slice(0, 3).map((match: any) => (
              <Link key={match.id} href={`/fanzone/${orgSlug}/matches/${match.id}`} className="block h-28">
                <MatchCard match={match} variant="horizontal" />
              </Link>
            )) : (
              <div className="text-sm font-medium text-text-muted bg-bg-surface rounded-xl border border-dashed border-border-dim text-center flex flex-col items-center justify-center h-32 w-full">
                <Activity className="w-6 h-6 text-border-strong mb-2" />
                No recent results found
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 border-b border-border-dim pb-3">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Calendar size={16} className="text-brand-primary" /> Upcoming Fixtures
            </h2>
            <Link href={`/fanzone/${orgSlug}/matches`} className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
             <div className="text-sm font-medium text-text-muted bg-bg-surface rounded-xl border border-dashed border-border-dim text-center flex flex-col items-center justify-center h-32 w-full">
                <Calendar className="w-6 h-6 text-border-strong mb-2" />
                Upcoming fixtures will appear here
             </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED TEAMS */}
      {featuredTeams && featuredTeams.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4 border-b border-border-dim pb-3">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Trophy size={16} className="text-brand-primary" /> Featured Teams
            </h2>
            <Link href={`/fanzone/${orgSlug}/organizations`} className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
              All Teams <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTeams.map((team: any) => (
              <FeaturedTeamCard key={team.id} team={team} orgSlug={orgSlug} />
            ))}
          </div>
        </section>
      )}
      
    </div>
  )
}
