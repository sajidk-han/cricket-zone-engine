import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BarChart2 } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tournament } = await supabase.from('tournaments').select('name').eq('slug', slug).single()
  return { title: `Statistics - ${tournament?.name || 'Tournament'} | CricketZone` }
}

export default async function TournamentStats({ params }: { params: Promise<{ slug: string, orgSlug: string }> }) {
  const { slug, orgSlug } = await params
  const supabase = await createClient()
  
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (error || !tournament) notFound()

  // Orange Cap (Most Runs)
  const { data: topBatters } = await supabase
    .from('tournament_statistics')
    .select('player_id, runs_scored, matches_played, highest_score, players(full_name, slug), teams(name)')
    .eq('tournament_id', tournament.id)
    .order('runs_scored', { ascending: false })
    .limit(10)

  // Purple Cap (Most Wickets)
  const { data: topBowlers } = await supabase
    .from('tournament_statistics')
    .select('player_id, wickets_taken, matches_played, runs_conceded, players(full_name, slug), teams(name)')
    .eq('tournament_id', tournament.id)
    .order('wickets_taken', { ascending: false })
    .order('runs_conceded', { ascending: true }) // Tie breaker
    .limit(10)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BarChart2 className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold text-text-primary">Tournament Statistics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Runs */}
        <div className="bg-bg-panel border border-border-dim rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border-dim bg-orange-500/5">
            <h3 className="text-lg font-bold text-orange-500">Most Runs (Orange Cap)</h3>
          </div>
          <div className="divide-y divide-border-dim/50">
            {topBatters && topBatters.length > 0 ? topBatters.map((b: any, i: number) => (
              <Link key={b.player_id} href={`/fanzone/${orgSlug}/players/${b.players?.slug}`} className="flex items-center justify-between p-4 hover:bg-bg-base/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className={`w-6 text-center font-bold ${i === 0 ? 'text-orange-500 text-lg' : 'text-text-muted'}`}>{i + 1}</span>
                  <div>
                    <div className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">{b.players?.full_name}</div>
                    <div className="text-xs text-text-muted">{b.teams?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-text-primary">{b.runs_scored}</div>
                  <div className="text-xs text-text-muted">{b.matches_played} Mat • HS: {b.highest_score}</div>
                </div>
              </Link>
            )) : (
              <div className="p-8 text-center text-text-muted">No batting statistics available.</div>
            )}
          </div>
        </div>

        {/* Most Wickets */}
        <div className="bg-bg-panel border border-border-dim rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border-dim bg-purple-500/5">
            <h3 className="text-lg font-bold text-purple-500">Most Wickets (Purple Cap)</h3>
          </div>
          <div className="divide-y divide-border-dim/50">
            {topBowlers && topBowlers.length > 0 ? topBowlers.map((b: any, i: number) => (
              <Link key={b.player_id} href={`/fanzone/${orgSlug}/players/${b.players?.slug}`} className="flex items-center justify-between p-4 hover:bg-bg-base/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className={`w-6 text-center font-bold ${i === 0 ? 'text-purple-500 text-lg' : 'text-text-muted'}`}>{i + 1}</span>
                  <div>
                    <div className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">{b.players?.full_name}</div>
                    <div className="text-xs text-text-muted">{b.teams?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-text-primary">{b.wickets_taken}</div>
                  <div className="text-xs text-text-muted">{b.matches_played} Mat</div>
                </div>
              </Link>
            )) : (
              <div className="p-8 text-center text-text-muted">No bowling statistics available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
