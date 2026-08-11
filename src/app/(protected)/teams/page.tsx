import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import Link from 'next/link'
import { fetchTeams } from '@/app/actions/teams'
import { CreateTeamDrawer } from '@/features/teams/components/CreateTeamDrawer'

export default async function TeamsList() {
  const teams = await fetchTeams()

  // Get user context for permissions
  const { createClient } = await import('@/lib/supabase-server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let canCreateTeam = false;
  
  if (user) {
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = getAdminClient()
      const { data: dbUser } = await adminClient.from('users').select('id').eq('auth_id', user.id).single()
      if (dbUser) {
        const { data: members } = await adminClient.from('organization_members').select('role').eq('user_id', dbUser.id)
        if (members) {
          canCreateTeam = members.some((m: any) => ['owner', 'admin', 'organizer', 'super_admin'].includes(m.role))
        }
      }
    } catch(e) {}
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Teams Directory</h1>
          <p className="text-text-secondary mt-1">Manage all franchise and club teams in your organization.</p>
        </div>
        {canCreateTeam && <CreateTeamDrawer />}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.length === 0 ? (
           <div className="col-span-full py-12 text-center border border-bg-elevated rounded-xl bg-bg-surface">
              <p className="text-text-secondary mb-4">No teams registered yet.</p>
           </div>
        ) : (
          teams.map(team => (
            <Link key={team.id} href={`/teams/${team.id}`} className="block group relative">
              <Card className="hover:border-brand-primary/50 transition-colors h-full">
                <CardContent className="p-6 flex flex-col items-center text-center relative">
                  <div className="w-20 h-20 rounded-2xl bg-bg-base border border-bg-elevated flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                    {team.logo_url ? <img src={team.logo_url} alt="Logo" className="w-full h-full object-cover" /> : '🛡️'}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{team.name}</h3>
                  <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">{team.short_name}</p>
                  
                  <div className="mt-6 w-full pt-4 border-t border-bg-elevated flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Roster</span>
                    <span className="font-bold text-text-primary">0</span> {/* Requires relation fetch in future */}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

