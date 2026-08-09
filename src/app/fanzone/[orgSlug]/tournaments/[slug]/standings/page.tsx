import { createAdminClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Trophy } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createAdminClient()
  const { data: tournament } = await supabase.from('tournaments').select('name').eq('slug', slug).single()
  return { title: `Points Table - ${tournament?.name || 'Tournament'} | CricketZone` }
}

export default async function TournamentStandings({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createAdminClient()
  
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (error || !tournament) notFound()

  const { data: standings } = await supabase
    .from('tournament_standings_cache')
    .select(`
      team_id, played, won, lost, tied, no_result, points, nrr,
      team:teams(name, short_name, logo_url)
    `)
    .eq('tournament_id', tournament.id)
    .order('position', { ascending: true })
    .order('net_run_rate', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-brand-primary" />
        <h2 className="text-2xl font-bold text-text-primary">Points Table</h2>
      </div>

      <div className="bg-bg-panel border border-border-dim rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base/50 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-dim">
                <th className="p-4 w-12 text-center">Pos</th>
                <th className="p-4">Team</th>
                <th className="p-4 text-center">P</th>
                <th className="p-4 text-center">W</th>
                <th className="p-4 text-center">L</th>
                <th className="p-4 text-center">T</th>
                <th className="p-4 text-center">NR</th>
                <th className="p-4 text-center font-bold text-brand-primary">Pts</th>
                <th className="p-4 text-center">NRR</th>
                <th className="p-4 text-center hidden md:table-cell">For</th>
                <th className="p-4 text-center hidden md:table-cell">Against</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dim/50">
              {standings && standings.length > 0 ? (
                standings.map((row: any, i: number) => (
                  <tr key={row.team_id} className="hover:bg-bg-base/30 transition-colors group">
                    <td className="p-4 text-center text-text-muted font-medium">{i + 1}</td>
                    <td className="p-4 font-semibold text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
                          {row.team?.logo_url ? (
                            <img src={row.team.logo_url} alt={row.team.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold">{row.team?.short_name || 'T'}</span>
                          )}
                        </div>
                        {row.team?.name}
                      </div>
                    </td>
                    <td className="p-4 text-center text-text-secondary">{row.played}</td>
                    <td className="p-4 text-center text-green-500 font-medium">{row.won}</td>
                    <td className="p-4 text-center text-red-500 font-medium">{row.lost}</td>
                    <td className="p-4 text-center text-yellow-500">{row.tied}</td>
                    <td className="p-4 text-center text-text-secondary">{row.no_result}</td>
                    <td className="p-4 text-center font-bold text-brand-primary text-lg">{row.points}</td>
                    <td className="p-4 text-center text-text-secondary font-medium">
                      {row.nrr > 0 ? '+' : ''}{Number(row.nrr || 0).toFixed(3)}
                    </td>
                    <td className="p-4 text-center text-text-muted text-xs hidden md:table-cell">
                      {row.runs_for || 0}/{Number(row.overs_for || 0).toFixed(1)}
                    </td>
                    <td className="p-4 text-center text-text-muted text-xs hidden md:table-cell">
                      {row.runs_against || 0}/{Number(row.overs_against || 0).toFixed(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-text-muted">
                    No standings available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
