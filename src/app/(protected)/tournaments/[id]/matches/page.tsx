import React from 'react'
import { fetchTournamentMatches } from '@/app/actions/matches'
import { getTournamentTeams } from '@/app/actions/tournaments'
import { TournamentMatchesClient } from './client'

export default async function TournamentMatchesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  // Fetch matches and enrolled teams in parallel
  const [matchesRes, teamsRes] = await Promise.all([
    fetchTournamentMatches(resolvedParams.id),
    getTournamentTeams(resolvedParams.id)
  ])
  
  if (!matchesRes.success) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
        <h3 className="font-bold mb-2">Failed to load matches</h3>
        <p className="text-sm opacity-80">{matchesRes.message}</p>
      </div>
    )
  }

  return (
    <TournamentMatchesClient 
      tournamentId={resolvedParams.id} 
      initialMatches={matchesRes.data || []} 
      enrolledTeams={teamsRes.data || []}
    />
  )
}
