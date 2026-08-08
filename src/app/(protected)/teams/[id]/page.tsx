import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import { Badge } from '@/shared/components/ui/Badge'
import Link from 'next/link'
import { fetchTeamById, fetchTeamRoster } from '@/app/actions/teams'
import { notFound } from 'next/navigation'
import { AssignPlayerModal } from '@/features/teams/components/AssignPlayerModal'
import { TeamPlayerActions } from '@/features/teams/components/TeamPlayerActions'
import { EditTeamModal } from '@/features/teams/components/EditTeamModal'

export default async function TeamWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const teamId = resolvedParams.id
  
  // Fetch dynamic data
  const team = await fetchTeamById(teamId)
  if (!team) {
    notFound()
  }

  const roster = await fetchTeamRoster(teamId)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/teams" className="text-text-secondary hover:text-text-primary transition-colors">
              &larr; Teams
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-bg-base border border-bg-elevated flex items-center justify-center text-3xl overflow-hidden shadow-sm">
              {team.logo_url ? (
                <img src={team.logo_url} alt={`${team.name} Logo`} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold">{team.short_name.substring(0, 3)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary tracking-tight">{team.name}</h1>
              <p className="text-text-secondary mt-1">{team.short_name} • Team Roster</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <EditTeamModal team={team} />
        </div>
      </div>

      <Tabs defaultValue="roster">
        <TabsList className="max-w-md">
          <TabsTrigger value="roster">Roster ({roster.length})</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
          <TabsTrigger value="stats">Team Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <div className="mt-6 flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Current Roster</h2>
            {roster.length > 0 && <AssignPlayerModal teamId={teamId} teamName={team.name} />}
          </div>
          
          {roster.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-bg-elevated rounded-xl">
              <p className="text-text-secondary mb-4">No players have been assigned to this team yet.</p>
              <AssignPlayerModal teamId={teamId} teamName={team.name} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Jersey</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {roster.map((p: any) => (
                  <TableRow key={p.team_player_id}>
                    <TableCell>
                      <div className="font-bold text-text-primary flex items-center gap-2">
                        {p.name}
                        {p.role === 'Captain' && <Badge variant="warning">C</Badge>}
                        {p.role === 'Vice Captain' && <Badge variant="warning">VC</Badge>}
                        {p.player_role === 'wicketkeeper' && <Badge variant="default">WK</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary capitalize">{p.player_role || 'Player'}</TableCell>
                    <TableCell>{p.jersey || '-'}</TableCell>
                    <TableCell className="text-right">
                      <TeamPlayerActions player={p} teamId={teamId} />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="mt-6">
            <Card>
              <CardContent className="p-10 text-center">
                <span className="text-4xl mb-4 block">📈</span>
                <p className="text-lg font-bold">Match History</p>
                <p className="text-text-secondary">Matches played by {team.name} will appear here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="mt-6">
            <Card>
              <CardContent className="p-10 text-center">
                <span className="text-4xl mb-4 block">📊</span>
                <p className="text-lg font-bold">Team Stats</p>
                <p className="text-text-secondary">Detailed analytics will appear once the team plays a match.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
