import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import { Badge } from '@/shared/components/ui/Badge'
import Link from 'next/link'
import { DeleteEntityButton } from '@/shared/components/ui/DeleteEntityButton'
import { fetchTeamById, fetchTeamRoster, deleteTeam, fetchTeamMatches } from '@/app/actions/teams'
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
  const matches = await fetchTeamMatches(teamId)

  // Compute stats
    const stats = { won: 0, lost: 0, tied: 0 }
  matches.forEach((m: any) => {
    if (m.status === 'completed' || m.status === 'verified' || m.status === 'archived') {
      if (m.winning_team_id === teamId) {
        stats.won++
      } else if (m.winning_team_id) {
        stats.lost++
      } else {
        stats.tied++
      }
    }
  })

  // Get user context for permissions
  const { createClient } = await import('@/lib/supabase-server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole = 'viewer'
  let internalUserId = null
  
  if (user) {
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const { getDefaultOrgId } = await import('@/app/actions/org')
      const adminClient = getAdminClient()
      const { data: dbUser } = await adminClient.from('users').select('id').eq('auth_id', user.id).single()
      if (dbUser) {
        internalUserId = dbUser.id
        const orgId = await getDefaultOrgId()
        const { data: member } = await adminClient.from('organization_members').select('role').eq('user_id', dbUser.id).eq('org_id', orgId).single()
        if (member) userRole = member.role
      }
    } catch(e) {}
  }

  const canDeleteTeam = 
    userRole === 'owner' || 
    userRole === 'admin' || 
    userRole === 'super_admin' || 
    (userRole === 'organizer' && team.created_by === internalUserId && internalUserId);

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
        <div className="flex gap-3 items-center">
          {canDeleteTeam && <EditTeamModal team={team} />}
          {canDeleteTeam && (
            <DeleteEntityButton 
              id={team.id} 
              onDelete={deleteTeam} 
              confirmMessage={`Are you sure you want to delete ${team.name}?`}
              redirectTo="/teams"
            />
          )}
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
            {(canDeleteTeam && roster.length > 0) && <AssignPlayerModal teamId={teamId} teamName={team.name} />}
          </div>
          
          {roster.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-bg-elevated rounded-xl">
              <p className="text-text-secondary mb-4">No players have been assigned to this team yet.</p>
              {canDeleteTeam && <AssignPlayerModal teamId={teamId} teamName={team.name} />}
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
                      {canDeleteTeam && <TeamPlayerActions player={p} teamId={teamId} />}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold">Match History</h2>
            {matches.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <span className="text-4xl mb-4 block">📈</span>
                  <p className="text-lg font-bold">No Matches Yet</p>
                  <p className="text-text-secondary">Matches played by {team.name} will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {matches.map((match: any) => (
                  <Card key={match.id} className="hover:border-brand-primary/50 transition-colors">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex-1 flex justify-between items-center w-full">
                        <div className="text-center flex-1">
                          <p className="font-bold text-lg">{match.team1?.short_name}</p>
                        </div>
                        <div className="px-4 text-center">
                          <Badge variant="outline" className="mb-1">{match.status}</Badge>
                          <p className="text-xs text-text-secondary">vs</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-bold text-lg">{match.team2?.short_name}</p>
                        </div>
                      </div>
                      <div className="text-sm text-text-secondary whitespace-nowrap text-right">
                        <p>{match.tournament?.name}</p>
                        <p>{new Date(match.scheduled_time || match.created_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="mt-6 space-y-6">
            <h2 className="text-xl font-bold">Team Statistics</h2>
            {matches.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <span className="text-4xl mb-4 block">📊</span>
                  <p className="text-lg font-bold">No Stats Available</p>
                  <p className="text-text-secondary">Detailed analytics will appear once the team plays a match.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Matches Played</p>
                    <p className="text-4xl font-black text-text-primary">{matches.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center border-b-4 border-green-500">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Won</p>
                    <p className="text-4xl font-black text-green-500">{stats.won}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center border-b-4 border-red-500">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Lost</p>
                    <p className="text-4xl font-black text-red-500">{stats.lost}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center border-b-4 border-yellow-500">
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Tied/NR</p>
                    <p className="text-4xl font-black text-yellow-500">{stats.tied}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
