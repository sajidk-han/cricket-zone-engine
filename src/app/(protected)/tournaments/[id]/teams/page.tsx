import React from 'react'
import { getTournamentTeams } from '@/app/actions/tournaments'
import { TournamentTeamsClient } from './client'

export default async function TournamentTeamsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getTournamentTeams(resolvedParams.id)
  
  if (!res.success) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
        <h3 className="font-bold mb-2">Failed to load teams</h3>
        <p className="text-sm opacity-80">{res.message}</p>
      </div>
    )
  }

  return (
    <TournamentTeamsClient 
      tournamentId={resolvedParams.id} 
      initialTeams={res.data || []} 
    />
  )
}
