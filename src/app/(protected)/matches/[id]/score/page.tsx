import React from 'react'
import { ScoringTerminal } from '@/features/scoring/components/ScoringTerminal'

export default function MatchScoringPage({ params }: { params: { id: string } }) {
  // In a real scenario, fetch match context, line-ups, etc. here
  const matchId = params.id

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <ScoringTerminal matchId={matchId} />
    </div>
  )
}
