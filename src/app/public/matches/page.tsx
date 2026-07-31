"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PublicMatches() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicMatches()
  }, [])

  const fetchPublicMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*, team1:team1_id(name), team2:team2_id(name), tournament:tournament_id(name)')
      .order('created_at', { ascending: false })
    
    if (data) setMatches(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 p-10 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">Live Matches & Scoreboard</h1>
            <p className="text-gray-400 text-sm mt-1">Public Fan Portal — Watch live scores in real-time</p>
          </div>
          <Link 
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-700 transition-colors"
          >
            Admin Login
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 font-mono">Loading public scoreboard...</p>
        ) : matches.length === 0 ? (
          <p className="text-yellow-500 bg-yellow-900/20 p-4 rounded-lg border border-yellow-800/40">
            No live matches currently available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {matches.map((m) => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl hover:border-gray-700 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-wider bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                    {m.tournament?.name || 'Tournament'}
                  </span>
                  <span className="text-xs uppercase tracking-widest font-bold text-green-400 bg-green-950/40 border border-green-800/50 px-3 py-1 rounded-full animate-pulse">
                    ● LIVE
                  </span>
                </div>

                <div className="flex justify-between items-center my-6">
                  <div className="text-2xl font-bold text-gray-100 w-1/3 text-right">
                    {m.team1?.name}
                  </div>
                  <div className="text-gray-500 font-bold text-sm tracking-widest px-4">
                    VS
                  </div>
                  <div className="text-2xl font-bold text-gray-100 w-1/3 text-left">
                    {m.team2?.name}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-sm">
                  <div className="text-gray-400">
                    Toss: <span className="text-gray-200 font-medium">Won & elected to {m.toss_decision} first</span>
                  </div>
                  <Link 
                    href={`/public/match/${m.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-md"
                  >
                    View Live Scorecard →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
