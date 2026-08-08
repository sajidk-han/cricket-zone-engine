"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft } from 'lucide-react'
import { LiveStreamPlayer } from '@/features/match-engine/components/widgets/LiveStreamPlayer'
import { MatchStatus } from '@/shared/components/ui/StatusBadge'
import { BroadcastScoreStrip } from '@/features/match-engine/components/public/BroadcastScoreStrip'
import { FullScorecard } from '@/features/match-engine/components/public/FullScorecard'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FanZoneMatchPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string
  const orgSlug = params.orgSlug as string

  const [matchData, setMatchData] = useState<any>(null)
  const [matchStats, setMatchStats] = useState<any>(null)
  const [playersMap, setPlayersMap] = useState<Record<string, string>>({})
  
  // All ball events for the current innings, used to calculate scorecard locally
  const [ballEvents, setBallEvents] = useState<any[]>([])
  
  const [playingXi, setPlayingXi] = useState<any[]>([])
  const [targetInfo, setTargetInfo] = useState<{ runs: number, rr: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // 1. Initial Load: Fetch Canonical State ONCE
  const fetchInitialState = async () => {
    
    // Fetch Basic Match View (Public Safe)
    const { data: mData } = await supabase
      .from('live_match_view')
      .select('*')
      .eq('id', matchId)
      .single()
    
    if (!mData) {
      setLoading(false)
      return
    }

    // Fetch match statistics and live stream url
    const { data: statData } = await supabase
      .from('matches')
      .select('match_statistics, live_stream_url, scheduled_overs')
      .eq('id', matchId)
      .single()
    
    if (statData?.match_statistics) {
      setMatchStats(statData.match_statistics)
    }
    mData.live_stream_url = statData?.live_stream_url
    mData.scheduled_overs = statData?.scheduled_overs || 20

    setMatchData(mData)

    // Fetch Playing XI (For Full Scorecard)
    const { data: xiData } = await supabase
      .from('match_playing_xi')
      .select(`id, team_id, batting_position, is_captain, is_wicket_keeper, player:players(id, full_name)`)
      .eq('match_id', matchId)
      .order('batting_position', { ascending: true })

    if (xiData) {
      setPlayingXi(xiData)
      const map: Record<string, string> = {}
      xiData.forEach(p => map[p.player.id] = p.player.full_name)
      setPlayersMap(map)
    }

    // Fetch All Balls for the current innings (Max ~120 rows, very fast, done ONLY once on load)
    let fetchedBalls: any[] = []
    if (mData.current_innings_id) {
      const { data: balls } = await supabase
        .from('ball_events')
        .select('*')
        .eq('innings_id', mData.current_innings_id)
        .order('delivery_sequence', { ascending: true })
      
      if (balls) {
         setBallEvents(balls)
         fetchedBalls = balls
      }
    }

    // Combine player IDs from all sources (Playing XI, Match Stats, Ball Events) to fetch names
    const pIds = new Set<string>()
    if (xiData) {
       xiData.forEach(p => pIds.add(p.player.id))
    }
    if (statData?.match_statistics) {
       if (statData.match_statistics.current_striker) pIds.add(statData.match_statistics.current_striker)
       if (statData.match_statistics.current_non_striker) pIds.add(statData.match_statistics.current_non_striker)
       if (statData.match_statistics.current_bowler) pIds.add(statData.match_statistics.current_bowler)
    }
    fetchedBalls.forEach(b => {
       if (b.striker_id) pIds.add(b.striker_id)
       if (b.non_striker_id) pIds.add(b.non_striker_id)
       if (b.bowler_id) pIds.add(b.bowler_id)
       if (b.dismissed_player_id) pIds.add(b.dismissed_player_id)
    })

    if (pIds.size > 0) {
      const { data: playersData } = await supabase
        .from('players')
        .select('id, full_name')
        .in('id', Array.from(pIds))
      
      if (playersData) {
        const map: Record<string, string> = {}
        playersData.forEach(p => map[p.id] = p.full_name)
        setPlayersMap(map)
      }
    }

    // Fetch Target if Innings 2
    if (mData.current_innings === 2) {
      const { data: firstInnings } = await supabase
        .from('innings')
        .select('total_runs')
        .eq('match_id', matchId)
        .eq('innings_number', 1)
        .single()
      
      if (firstInnings) {
        const target = firstInnings.total_runs + 1
        let reqRR = '0.00'
        const totalOvers = statData?.scheduled_overs || 20
        const oversBowled = mData.overs_bowled || 0
        const oversLeft = totalOvers - oversBowled
        if (oversLeft > 0) {
          reqRR = ((target - (mData.total_runs || 0)) / oversLeft).toFixed(2)
        }
        setTargetInfo({ runs: target, rr: reqRR })
      }
    }

    setLoading(false)
  }

  // 2. Setup Single Realtime Subscription
  useEffect(() => {
    fetchInitialState()

    const matchChannel = supabase
      .channel(`public-match-${matchId}`)
      
      // Listen to Match Statistics (Active Striker/Bowler updates)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` }, (payload) => {
        if (payload.new.match_statistics) {
           setMatchStats(payload.new.match_statistics)
        }
        if (payload.new.status !== undefined) {
           setMatchData((prev: any) => ({ ...prev, status: payload.new.status }))
        }
      })
      
      // Listen to Innings (Score updates)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'innings', filter: `match_id=eq.${matchId}` }, (payload) => {
         setMatchData((prev: any) => {
            if (prev && prev.current_innings_id === payload.new.id) {
               return {
                  ...prev,
                  total_runs: payload.new.total_runs,
                  total_wickets: payload.new.total_wickets,
                  overs_bowled: payload.new.overs_bowled
               }
            }
            return prev
         })
      })
      
      // Listen to Ball Events (Incremental Timeline/Scorecard Updates)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ball_events' }, (payload) => {
         // Only add if it belongs to current innings to prevent duplicate/stale balls
         setBallEvents(prev => {
            if (prev.some(b => b.id === payload.new.id)) return prev // Prevent duplicates
            return [...prev, payload.new]
         })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(matchChannel)
    }
  }, [matchId])

  // 3. Dynamically fetch missing player names (e.g. when a new bowler is selected via realtime)
  useEffect(() => {
    if (!matchStats && ballEvents.length === 0) return

    const missingIds = new Set<string>()
    
    if (matchStats) {
       if (matchStats.current_striker && !playersMap[matchStats.current_striker]) missingIds.add(matchStats.current_striker)
       if (matchStats.current_non_striker && !playersMap[matchStats.current_non_striker]) missingIds.add(matchStats.current_non_striker)
       if (matchStats.current_bowler && !playersMap[matchStats.current_bowler]) missingIds.add(matchStats.current_bowler)
    }
    
    // Also check last few balls just in case
    ballEvents.slice(-6).forEach(b => {
       if (b.striker_id && !playersMap[b.striker_id]) missingIds.add(b.striker_id)
       if (b.non_striker_id && !playersMap[b.non_striker_id]) missingIds.add(b.non_striker_id)
       if (b.bowler_id && !playersMap[b.bowler_id]) missingIds.add(b.bowler_id)
    })

    if (missingIds.size > 0) {
      const fetchMissing = async () => {
        const { data } = await supabase.from('players').select('id, full_name').in('id', Array.from(missingIds))
        if (data) {
           setPlayersMap(prev => {
              const newMap = { ...prev }
              data.forEach(p => newMap[p.id] = p.full_name)
              return newMap
           })
        }
      }
      fetchMissing()
    }
  }, [matchStats, ballEvents, playersMap])

  if (loading) {
    return <div className="min-h-screen bg-bg-base flex items-center justify-center"><div className="animate-spin text-brand-primary text-4xl">🏏</div></div>
  }

  if (!matchData) {
    return <div className="min-h-screen bg-bg-base flex items-center justify-center text-text-primary">Match not found.</div>
  }

  // Derived state for Broadcast Strip
  const recentBalls = ballEvents.slice(-6)

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center p-2 md:p-4 font-sans text-text-primary selection:bg-brand-primary/30">
      
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-0 animate-in fade-in duration-700">
        
        {/* Header Back Button */}
        <button 
          onClick={() => router.push(`/fanzone/${orgSlug}/live`)}
          className="self-start flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} /> Back to Live Feed
        </button>

        {/* 1. Live Stream Player */}
        {matchData.live_stream_url ? (
           <div className="w-full shadow-2xl rounded-t-xl overflow-hidden border border-bg-elevated border-b-0 bg-black">
              <LiveStreamPlayer 
                url={matchData.live_stream_url} 
                status={(matchData.status || 'scheduled') as MatchStatus} 
              />
           </div>
        ) : (
           <div className="w-full h-48 sm:h-64 md:h-96 bg-black rounded-t-xl flex items-center justify-center border border-bg-elevated border-b-0 text-text-muted">
              No Live Stream Available
           </div>
        )}

        {/* 2. Broadcast Score Strip */}
        {matchData.status === 'live' || matchData.status === 'completed' || matchData.status === 'abandoned' ? (
           <BroadcastScoreStrip 
             matchData={matchData} 
             matchStats={matchStats} 
             playersMap={playersMap} 
             recentBalls={recentBalls} 
             targetInfo={targetInfo} 
           />
        ) : (
           <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-b-xl border border-t-0 border-indigo-500/30 p-4 text-center text-slate-400 font-bold uppercase tracking-widest shadow-2xl">
             Match is {matchData.status}
           </div>
        )}

        {/* 3. Full Public Scorecard */}
        {(matchData.status === 'live' || matchData.status === 'completed') && (
           <FullScorecard 
             playingXi={playingXi}
             ballEvents={ballEvents}
             inningsId={matchData.current_innings_id}
             battingTeamId={matchData.batting_team_id}
             bowlingTeamId={matchData.team1_id === matchData.batting_team_id ? matchData.team2_id : matchData.team1_id}
             playersMap={playersMap}
           />
        )}
      </div>
    </div>
  )
}
