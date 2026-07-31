"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function PublicMatchView() {
  const { id } = useParams()
  const [match, setMatch] = useState<any>(null)

  useEffect(() => {
    fetchMatchData()
  }, [id])

  const fetchMatchData = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*, team1:team1_id(name), team2:team2_id(name), tournament:tournament_id(name)')
      .eq('id', id)
      .single()
    
    if (data) setMatch(data)
  }

  if (!match) return <div className="p-10 text-gray-400 font-mono flex justify-center items-center min-h-screen bg-gray-950">Loading Live Scorecard...</div>

  return (
    <main className="min-h-screen bg-gray-950 p-6 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/public/matches" className="text-blue-400 text-sm hover:underline">
            ← Back to Public Matches
          </Link>
        </div>

        {/* Public Scoreboard Display */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-600"></div>
          <p className="text-green-400 font-semibold tracking-widest uppercase text-sm mb-2">● Public Live Broadcast</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-6">
            {match.team1?.name} <span className="text-gray-600 mx-2">vs</span> {match.team2?.name}
          </h1>
          
          <div className="text-8xl font-extrabold tracking-tighter my-6 text-white">
            0<span className="text-4xl text-gray-500 font-normal">/0</span>
          </div>
          
          <div className="flex justify-center space-x-8 text-gray-400 text-lg border-t border-gray-800 pt-6">
            <div>Overs: <span className="font-bold text-gray-200">0.0</span></div>
            <div>Tournament: <span className="font-bold text-blue-400">{match.tournament?.name}</span></div>
          </div>
        </div>
      </div>
    </main>
  )
}
