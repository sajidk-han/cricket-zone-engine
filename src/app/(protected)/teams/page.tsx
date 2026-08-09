import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import Link from 'next/link'
import { fetchTeams, deleteTeam } from '@/app/actions/teams'
import { CreateTeamDrawer } from '@/features/teams/components/CreateTeamDrawer'
import { DeleteEntityButton } from '@/shared/components/ui/DeleteEntityButton'

export default async function TeamsList() {
  const teams = await fetchTeams()

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Teams Directory</h1>
          <p className="text-text-secondary mt-1">Manage all franchise and club teams in your organization.</p>
        </div>
        <CreateTeamDrawer />
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
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <DeleteEntityButton 
                      id={team.id} 
                      onDelete={deleteTeam} 
                      confirmMessage="Are you sure you want to delete this team? This action is irreversible."
                      iconOnly={true}
                    />
                  </div>
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

