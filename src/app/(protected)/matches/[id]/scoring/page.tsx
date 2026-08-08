import React from 'react'
import { getMatchSummary } from '@/app/actions/matches'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { LiveConsole } from '@/features/match-engine/components/LiveConsole'

export default async function MatchScoringPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getMatchSummary(resolvedParams.id)
  if (!res.success || !res.data) notFound()
  const match = res.data

  return (
    <div className="space-y-6">
      <LiveConsoleFetchWrapper match={match} />
    </div>
  )
}

async function fetchPlayingXI(matchId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('match_playing_xi')
    .select(`id, team_id, batting_position, is_captain, is_wicket_keeper, player:players(id, full_name)`)
    .eq('match_id', matchId)
    .order('batting_position', { ascending: true })

  if (error) return []
  return data || []
}

async function fetchCurrentInnings(matchId: string, currentInningsNum: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('innings').select('*').eq('match_id', matchId).eq('innings_number', currentInningsNum).single()
  return data
}

async function fetchLastBall(inningsId: string, matchId: string) {
  if (!inningsId) return null
  const supabase = await createClient()
  const { data } = await supabase.from('ball_events').select('*').eq('innings_id', inningsId).order('created_at', { ascending: false }).limit(1).single()
  if (data) return data

  const { data: initEvent } = await supabase.from('match_events').select('description').eq('match_id', matchId).eq('event_type', 'innings_start').order('event_time', { ascending: false }).limit(1).single()
  if (initEvent?.description && initEvent.description.startsWith('{')) {
    try {
      const parsedData = JSON.parse(initEvent.description)
      return { over_number: 0, striker_id: parsedData.strikerId, non_striker_id: parsedData.nonStrikerId, bowler_id: parsedData.bowlerId }
    } catch(e) { return null }
  }
  return null
}

async function fetchThisOverBalls(inningsId: string, overNumber: number) {
  if (!inningsId) return []
  const supabase = await createClient()
  const { data } = await supabase.from('ball_events').select('*').eq('innings_id', inningsId).eq('over_number', overNumber).order('ball_number', { ascending: true })
  return data || []
}

async function fetchDismissedPlayers(inningsId: string) {
  if (!inningsId) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('ball_events')
    .select('dismissed_player_id')
    .eq('innings_id', inningsId)
    .not('dismissed_player_id', 'is', null)
  return data?.map(d => d.dismissed_player_id) || []
}

async function fetchBatterStats(inningsId: string, batterId: string | undefined) {
  if (!inningsId || !batterId) return { runs: 0, balls: 0, fours: 0, sixes: 0 }
  const supabase = await createClient()
  const { data } = await supabase.from('ball_events').select('runs_off_bat, extras_type').eq('innings_id', inningsId).eq('striker_id', batterId)
    
  let runs = 0; let balls = 0; let fours = 0; let sixes = 0;
  if (data) {
    data.forEach(d => {
      runs += d.runs_off_bat;
      if (d.runs_off_bat === 4) fours++;
      if (d.runs_off_bat === 6) sixes++;
      if (d.extras_type !== 'wide') balls++;
    })
  }
  return { runs, balls, fours, sixes }
}

async function fetchBowlerStats(inningsId: string, bowlerId: string | undefined) {
  if (!inningsId || !bowlerId) return { overs: 0, maidens: 0, runs: 0, wickets: 0, dots: 0, totalBalls: 0 }
  const supabase = await createClient()
  const { data } = await supabase.from('ball_events').select('*').eq('innings_id', inningsId).eq('bowler_id', bowlerId)
  
  let runs = 0; let wickets = 0; let dots = 0; let totalBalls = 0;
  if (data) {
    data.forEach(d => {
      runs += d.runs_off_bat + d.extras_runs;
      if (d.is_wicket && !['run_out', 'obstructing_field', 'retired_hurt'].includes(d.wicket_type || '')) {
        wickets++;
      }
      if (d.runs_off_bat === 0 && d.extras_runs === 0 && !d.is_wicket) {
        dots++;
      }
      if (d.is_legal_delivery) totalBalls++;
    })
  }
  const overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
  return { overs, maidens: 0, runs, wickets, dots, totalBalls }
}

async function LiveConsoleFetchWrapper({ match }: { match: any }) {
  const [playingXi, currentInnings] = await Promise.all([
    fetchPlayingXI(match.id),
    fetchCurrentInnings(match.id, match.current_innings || 1)
  ])

  const lastBall = currentInnings ? await fetchLastBall(currentInnings.id, match.id) : null
  const thisOverBalls = lastBall ? await fetchThisOverBalls(currentInnings.id, lastBall.over_number) : []
  const dismissedPlayers = currentInnings ? await fetchDismissedPlayers(currentInnings.id) : []

  const currentStrikerId = match?.match_statistics?.current_striker || lastBall?.striker_id
  const currentNonStrikerId = match?.match_statistics?.current_non_striker || lastBall?.non_striker_id

  let strikerStats = { runs: 0, balls: 0, fours: 0, sixes: 0 }
  let nonStrikerStats = { runs: 0, balls: 0, fours: 0, sixes: 0 }
  let bowlerStats = { overs: 0, maidens: 0, runs: 0, wickets: 0, dots: 0, totalBalls: 0 }

  const currentBowlerId = match?.match_statistics?.current_bowler || lastBall?.bowler_id

  if (currentInnings) {
    [strikerStats, nonStrikerStats, bowlerStats] = await Promise.all([
      fetchBatterStats(currentInnings.id, currentStrikerId),
      fetchBatterStats(currentInnings.id, currentNonStrikerId),
      fetchBowlerStats(currentInnings.id, currentBowlerId)
    ])
  }

  return (
    <LiveConsole 
      matchId={match.id}
      team1={match.team1}
      team2={match.team2}
      match={match}
      playingXi={playingXi} 
      currentInnings={currentInnings}
      lastBall={lastBall}
      thisOverBalls={thisOverBalls}
      strikerStats={strikerStats}
      nonStrikerStats={nonStrikerStats}
      bowlerStats={bowlerStats}
      dismissedPlayers={dismissedPlayers}
    />
  )
}
