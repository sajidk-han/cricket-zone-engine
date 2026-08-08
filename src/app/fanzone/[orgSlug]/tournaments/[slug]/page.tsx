import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import MatchCard from '@/features/match-engine/components/MatchCard'

export default async function TournamentOverview({ params }: { params: Promise<{ slug: string, orgSlug: string }> }) {
  const { slug, orgSlug } = await params
  const supabase = await createClient()
  
  // 1. Fetch Tournament Context
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('id, name')
    .eq('slug', slug)
    .in('visibility', ['public', 'unlisted'])
    .single()

  if (error || !tournament) {
    notFound()
  }

  // 2. Fetch Recent & Live Matches
  const { data: matches } = await supabase
    .from('live_match_view')
    .select('*')
    .eq('tournament_id', tournament.id)
    .order('start_time', { ascending: false })
    .limit(3)

  // 3. Fetch Top 4 Standings from precomputed table
  const { data: standings } = await supabase
    .from('tournament_standings')
    .select('team_id, matches_played, points, net_run_rate, teams(name)')
    .eq('tournament_id', tournament.id)
    .order('points', { ascending: false })
    .order('net_run_rate', { ascending: false })
    .limit(4)

  return (
    <div className="space-y-12">
      
      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Recent Matches</h2>
            <Link 
              href={`/fanzone/${orgSlug}/tournaments/${slug}/matches`}
              className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {matches && matches.length > 0 ? (
              matches.map((m: any) => (
                <div key={m.id} className="cursor-pointer transition-transform hover:-translate-y-1">
                  <Link href={`/fanzone/${orgSlug}/matches/${m.id}`}>
                    <MatchCard match={m} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-bg-panel border border-border-dim rounded-2xl p-8 text-center text-text-secondary">
                No matches have been played yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Standings & Stats Snippet */}
        <div className="space-y-8">
          
          {/* Mini Standings */}
          <div className="bg-bg-panel border border-border-dim rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-primary" />
                Standings
              </h2>
              <Link 
                href={`/fanzone/${orgSlug}/tournaments/${slug}/standings`}
                className="text-brand-primary text-sm hover:underline"
              >
                Full Table
              </Link>
            </div>

            {standings && standings.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs font-semibold text-text-muted uppercase tracking-wider pb-2 border-b border-border-dim/50">
                  <div className="col-span-6">Team</div>
                  <div className="col-span-2 text-center">P</div>
                  <div className="col-span-2 text-center">Pts</div>
                  <div className="col-span-2 text-right">NRR</div>
                </div>
                {standings.map((row: any, i: number) => (
                  <div key={row.team_id} className="grid grid-cols-12 text-sm text-text-secondary items-center">
                    <div className="col-span-6 flex items-center gap-2">
                      <span className="text-text-muted font-medium w-4">{i + 1}</span>
                      <span className="font-semibold text-text-primary truncate" title={row.teams?.name}>{row.teams?.name}</span>
                    </div>
                    <div className="col-span-2 text-center">{row.matches_played}</div>
                    <div className="col-span-2 text-center font-bold text-text-primary">{row.points}</div>
                    <div className="col-span-2 text-right">{Number(row.net_run_rate).toFixed(3)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-text-muted text-center py-4">
                Standings will appear after the first match.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
