import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { User, Activity, Trophy, BarChart, Medal } from 'lucide-react'
import Link from 'next/link'
import MatchCard from '@/features/match-engine/components/MatchCard'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: player } = await supabase.from('players').select('full_name, batting_style').eq('slug', resolvedParams.slug).single()
  return { 
    title: `${player?.full_name || 'Player Profile'} | CricketZone`,
    description: `Official cricket profile for ${player?.full_name}. Batting Style: ${player?.batting_style || 'N/A'}`
  }
}

export default async function PlayerProfile({ params }: { params: Promise<{ slug: string, orgSlug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // 1. Fetch Player Context
  const { data: player, error } = await supabase
    .from('players')
    .select('id, full_name, batting_style, bowling_style, avatar_url, visibility')
    .eq('slug', resolvedParams.slug)
    .in('visibility', ['public', 'unlisted'])
    .single()

  if (error || !player) notFound()

  // 2. Fetch Career Stats
  const { data: careerStats } = await supabase
    .from('player_career_stats')
    .select('*')
    .eq('player_id', player.id)
    .single()

  // 3. Fetch Recent Match Stats (to derive recent form)
  const { data: recentStats } = await supabase
    .from('player_match_stats')
    .select('*, matches(id, start_time, team1_id, team2_id, status)')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const c = careerStats || {
    total_matches: 0, total_runs: 0, total_wickets: 0, highest_score: 0, best_bowling_figures: '-'
  }

  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-brand-primary/30">
      
      {/* Profile Header */}
      <div className="bg-bg-panel border-b border-border-dim">
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-base border-4 border-bg-base ring-2 ring-brand-primary/30 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
            {player.avatar_url ? (
              <img src={player.avatar_url} alt={player.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-text-muted" />
            )}
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight">
              {player.full_name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm font-medium">
              {player.batting_style && (
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Bat: {player.batting_style}
                </span>
              )}
              {player.bowling_style && (
                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Bowl: {player.bowling_style}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        
        {/* Career Stats Grid */}
        <section>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-brand-primary" /> Career Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-panel border border-border-dim rounded-2xl p-6 text-center">
              <div className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Matches</div>
              <div className="text-4xl font-black text-text-primary">{c.total_matches}</div>
            </div>
            <div className="bg-bg-panel border border-border-dim rounded-2xl p-6 text-center">
              <div className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Runs</div>
              <div className="text-4xl font-black text-text-primary">{c.total_runs}</div>
            </div>
            <div className="bg-bg-panel border border-border-dim rounded-2xl p-6 text-center">
              <div className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Wickets</div>
              <div className="text-4xl font-black text-text-primary">{c.total_wickets}</div>
            </div>
            <div className="bg-bg-panel border border-border-dim rounded-2xl p-6 text-center">
              <div className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">High Score</div>
              <div className="text-4xl font-black text-brand-primary">{c.highest_score}</div>
            </div>
          </div>
        </section>

        {/* Recent Matches */}
        <section>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-6">
            <BarChart className="w-5 h-5 text-brand-primary" /> Recent Form
          </h2>
          
          <div className="space-y-4">
            {recentStats && recentStats.length > 0 ? recentStats.map((stat: any) => (
              <div key={stat.id} className="bg-bg-panel border border-border-dim rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-bg-base/50 transition-colors">
                <div className="flex-1">
                  <div className="text-sm font-medium text-brand-primary mb-1">
                    {new Date(stat.matches?.start_time).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-text-primary">
                    <Link href={`/fanzone/${resolvedParams.orgSlug}/matches/${stat.match_id}`} className="hover:underline">
                      View Match
                    </Link>
                  </div>
                </div>
                
                <div className="flex gap-4 md:gap-8 divide-x divide-border-dim">
                  <div className="px-4 text-center">
                     <div className="text-xs text-text-muted font-medium mb-1">Batting</div>
                     <div className="font-bold text-text-primary">{stat.runs_scored} <span className="text-xs text-text-secondary font-normal">({stat.balls_faced})</span></div>
                     <div className="text-xs text-text-muted mt-1">{stat.fours}x4 • {stat.sixes}x6</div>
                  </div>
                  <div className="px-4 text-center pl-8">
                     <div className="text-xs text-text-muted font-medium mb-1">Bowling</div>
                     <div className="font-bold text-text-primary">{stat.wickets_taken}/{stat.runs_conceded}</div>
                     <div className="text-xs text-text-muted mt-1">{stat.overs_bowled} Overs</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center p-8 bg-bg-panel border border-border-dim rounded-2xl text-text-muted">
                No recent match data found.
              </div>
            )}
          </div>
        </section>
        
      </main>
    </div>
  )
}
