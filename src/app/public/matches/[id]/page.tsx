"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Using the standard client for real-time subscriptions on the client side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PublicMatchScorecard() {
  const params = useParams()
  const matchId = params.id as string

  const [matchData, setMatchData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch Initial Match State
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()
      
      if (data) {
        setMatchData(data)
      }
      setLoading(false)
    }

    fetchMatch()

    // 2. Subscribe to Real-time Updates for this specific match
    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
        (payload) => {
          console.log('Real-time Match Update:', payload)
          setMatchData(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin text-brand-primary text-4xl">🏏</div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Match not found or is no longer live.
      </div>
    )
  }

  // Fallbacks for Dummy UI until full match state machine is implemented
  const currentScore = matchData.current_score || '0/0'
  const currentOvers = matchData.current_overs || '0.0'
  const team1 = matchData.team1_id ? 'EAGLES' : 'TEAM 1'
  const team2 = matchData.team2_id ? 'TIGERS' : 'TEAM 2'

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Broadcast Graphics Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-brand-primary blur-[150px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-blue-900 blur-[150px]" />
      </div>

      <div className="z-10 w-full max-w-4xl animate-in fade-in zoom-in duration-700">
        
        {/* LIVE INDICATOR */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            LIVE BROADCAST
          </div>
        </div>

        {/* TV SCORECARD OVERLAY */}
        <div className="bg-gradient-to-r from-bg-base/90 via-bg-surface/90 to-bg-base/90 border border-bg-elevated backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl">
          
          {/* TOP BAR: Teams */}
          <div className="flex bg-bg-elevated/50 p-4 justify-between items-center text-sm font-bold tracking-widest text-text-secondary uppercase">
            <span>{team1}</span>
            <span className="text-brand-primary px-4 border-l border-r border-bg-elevated/50">VS</span>
            <span>{team2}</span>
          </div>

          {/* MAIN SCORE AREA */}
          <div className="p-12 flex flex-col items-center justify-center text-center relative">
            <h1 className="text-[120px] leading-none font-black text-white tracking-tighter drop-shadow-lg font-mono">
              {currentScore}
            </h1>
            
            <div className="mt-4 flex items-center gap-8 text-2xl font-medium text-text-secondary">
              <div>
                Overs: <span className="text-white font-bold">{currentOvers}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-bg-elevated"></div>
              <div>
                CRR: <span className="text-white font-bold">0.00</span>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR: Batter/Bowler Snapshot */}
          <div className="bg-gradient-to-r from-brand-primary to-blue-600 p-1">
            <div className="bg-bg-base flex justify-between">
              <div className="flex-1 p-6 border-r border-bg-elevated/30">
                <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-2">On Strike</p>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-bold text-white">Batter 1</span>
                  <span className="text-xl font-mono text-brand-primary">45 <span className="text-sm text-text-secondary">(28)</span></span>
                </div>
              </div>
              <div className="flex-1 p-6">
                <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-2">Bowling</p>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-bold text-white">Bowler 1</span>
                  <span className="text-xl font-mono text-brand-primary">2/24 <span className="text-sm text-text-secondary">(3.2)</span></span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      
    </div>
  )
}
