import React from 'react'
import { getMatchSummary } from '@/app/actions/matches'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { FullScorecard } from '@/features/match-engine/components/public/FullScorecard'

export default async function ScorecardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getMatchSummary(resolvedParams.id)
  if (!res.success || !res.data) notFound()
  const match = res.data

  const supabase = await createClient()

  // 1. Fetch current innings
  const { data: currentInnings } = await supabase
    .from('innings')
    .select('*')
    .eq('match_id', match.id)
    .eq('innings_number', match.current_innings || 1)
    .single()

  if (!currentInnings) {
    return <div className="p-8 text-center text-text-secondary">No scorecard data available yet.</div>
  }

  // 2. Fetch Playing XI
  const { data: playingXi } = await supabase
    .from('match_playing_xi')
    .select(`id, team_id, batting_position, is_captain, is_wicket_keeper, player:players(id, full_name)`)
    .eq('match_id', match.id)
    .order('batting_position', { ascending: true })

  // 3. Fetch Ball Events
  const { data: ballEvents } = await supabase
    .from('ball_events')
    .select('*')
    .eq('innings_id', currentInnings.id)
    .order('delivery_sequence', { ascending: true })

  // 4. Build Players Map
  const playersMap: Record<string, string> = {}
  playingXi?.forEach((p: any) => playersMap[p.player.id] = p.player.full_name)

  const pIds = new Set<string>()
  ballEvents?.forEach((b: any) => {
    if (b.striker_id) pIds.add(b.striker_id)
    if (b.non_striker_id) pIds.add(b.non_striker_id)
    if (b.bowler_id) pIds.add(b.bowler_id)
    if (b.dismissed_player_id) pIds.add(b.dismissed_player_id)
  })

  const missingIds = Array.from(pIds).filter(id => !playersMap[id])
  if (missingIds.length > 0) {
    const { data: playersData } = await supabase
      .from('players')
      .select('id, full_name')
      .in('id', missingIds)
    playersData?.forEach(p => playersMap[p.id] = p.full_name)
  }

  return (
    <div className="space-y-6">
      <FullScorecard 
        playingXi={playingXi || []}
        ballEvents={ballEvents || []}
        inningsId={currentInnings.id}
        battingTeamId={currentInnings.batting_team_id}
        bowlingTeamId={currentInnings.bowling_team_id}
        playersMap={playersMap}
      />
    </div>
  )
}
