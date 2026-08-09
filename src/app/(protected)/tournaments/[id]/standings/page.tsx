import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import { Badge } from '@/shared/components/ui/Badge'
import { ListOrdered, Trophy } from 'lucide-react'
import { getTournamentStandings } from '@/app/actions/tournaments'

export default async function StandingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const tournamentId = resolvedParams.id
  
  const res = await getTournamentStandings(tournamentId)
  const standings = res.data || []

  if (standings.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <ListOrdered size={40} className="text-brand-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Tournament Standings</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Points table will appear here once teams are registered and the engine calculates the standings.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy size={20} className="text-brand-primary" />
          Points Table
        </h2>
        <span className="text-xs text-text-secondary">
          Last updated: {new Date(standings[0]?.last_calculated_at || Date.now()).toLocaleString()}
        </span>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block overflow-hidden border-bg-elevated">
        <Table>
          <TableHeader className="bg-bg-elevated/50">
            <TableRow>
              <TableHead className="w-16 text-center">POS</TableHead>
              <TableHead>TEAM</TableHead>
              <TableHead className="text-center w-16">P</TableHead>
              <TableHead className="text-center w-16">W</TableHead>
              <TableHead className="text-center w-16">L</TableHead>
              <TableHead className="text-center w-16">T</TableHead>
              <TableHead className="text-center w-16">NR</TableHead>
              <TableHead className="text-center w-16 font-bold text-brand-primary">PTS</TableHead>
              <TableHead className="text-center w-24">NRR</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {standings.map((team: any, index: number) => (
              <TableRow key={team.team_id} className="hover:bg-bg-elevated/30">
                <TableCell className="text-center font-bold text-text-secondary">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-bg-base border border-bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
                      {team.team?.logo_url ? (
                        <img src={team.team.logo_url} alt={team.team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold">{team.team?.short_name || 'T'}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary leading-tight">{team.team?.name}</p>
                      <p className="text-xs text-text-muted">{team.team?.short_name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center text-green-500">{team.won}</TableCell>
                <TableCell className="text-center text-red-500">{team.lost}</TableCell>
                <TableCell className="text-center text-yellow-500">{team.tied}</TableCell>
                <TableCell className="text-center text-text-muted">{team.no_result}</TableCell>
                <TableCell className="text-center font-black text-brand-primary text-lg">{team.points}</TableCell>
                <TableCell className="text-center font-mono text-sm">{team.nrr > 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {standings.map((team: any, index: number) => (
          <Card key={team.team_id} className="border-bg-elevated overflow-hidden">
            <div className="flex items-center p-4">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-bg-elevated rounded-full mr-3 font-bold">
                {index + 1}
              </div>
              <div className="w-12 h-12 rounded-lg bg-bg-base border border-bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0 mr-4">
                {team.team?.logo_url ? (
                  <img src={team.team.logo_url} alt={team.team.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold">{team.team?.short_name || 'T'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-primary truncate">{team.team?.name}</p>
                <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                  <span>P: {team.played}</span>
                  <span className="text-green-500">W: {team.won}</span>
                  <span className="text-red-500">L: {team.lost}</span>
                </div>
              </div>
              <div className="text-right ml-2 flex flex-col justify-center items-end">
                <span className="text-2xl font-black text-brand-primary leading-none">{team.points}</span>
                <span className="text-[10px] text-text-muted mt-1 uppercase">Points</span>
              </div>
            </div>
            <div className="bg-bg-elevated/30 px-4 py-2 border-t border-bg-elevated flex justify-between text-xs">
              <span className="text-text-secondary">T/NR: {team.tied}/{team.no_result}</span>
              <span className="font-mono text-text-secondary">NRR: {team.nrr > 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
