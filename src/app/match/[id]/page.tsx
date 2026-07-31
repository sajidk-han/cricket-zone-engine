"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function ScoringDashboard() {
  const { id } = useParams()
  const [match, setMatch] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  
  // Naye States: Striker, Non-Striker aur Bowler ko track karne ke liye
  const [striker, setStriker] = useState('')
  const [nonStriker, setNonStriker] = useState('')
  const [bowler, setBowler] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    // Match details fetch karo
    const { data: matchData } = await supabase
      .from('matches')
      .select('*, team1:team1_id(name), team2:team2_id(name)')
      .eq('id', id)
      .single()
    
    if (matchData) {
      setMatch(matchData)
      // Dono teams ke players ko database se le kar aao
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .in('team_id', [matchData.team1_id, matchData.team2_id])
      if (playersData) setPlayers(playersData)
    }
  }

  // Asal Engine: Jab koi button dabega toh yeh function chalega
  const recordBall = async (runs: number) => {
    if (!striker || !nonStriker || !bowler) {
      return alert("Action Denied: Pehle dropdown se Striker, Non-Striker aur Bowler select karo!")
    }
    
    if (striker === nonStriker) {
      return alert("Action Denied: Striker aur Non-Striker same player nahi ho sakte!")
    }
    
    const { error } = await supabase.from('ball_by_ball_events').insert([{
      match_id: id,
      striker_id: striker,
      non_striker_id: nonStriker,
      bowler_id: bowler,
      runs_off_bat: runs,
      extras: 0,
      is_wicket: false,
      innings_number: 1,
      over_number: 1,
      ball_number: 1
    }])

    if (error) {
      alert("Database Error: " + error.message)
    } else {
      alert(`Success! ${runs} runs permanently saved to database.`)
    }
  }

  if (!match) return <div className="p-10 text-gray-400 font-mono flex justify-center items-center min-h-screen bg-gray-950">Initializing Match Engine...</div>

  return (
    <main className="min-h-screen bg-gray-950 p-6 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Scoreboard Header */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <p className="text-blue-500 font-semibold tracking-widest uppercase text-sm mb-2">Live Match</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4">
            {match.team1?.name} <span className="text-gray-600 mx-2">vs</span> {match.team2?.name}
          </h1>
          <div className="text-7xl font-extrabold tracking-tighter my-6 text-white">
            0<span className="text-4xl text-gray-500 font-normal">/0</span>
          </div>
        </div>

        {/* Player Selection Module */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-900 p-4 border border-gray-800 rounded-lg">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Striker</label>
            <select value={striker} onChange={(e) => setStriker(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500">
              <option value="">-- Select Batsman --</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Non-Striker</label>
            <select value={nonStriker} onChange={(e) => setNonStriker(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500">
              <option value="">-- Select Batsman --</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Bowler</label>
            <select value={bowler} onChange={(e) => setBowler(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500">
              <option value="">-- Select Bowler --</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>)}
            </select>
          </div>
        </div>

        {/* Control Panel (Scoring Buttons) */}
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Scoring Controls</h2>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[0, 1, 2, 3, 4, 6].map(runs => (
            <button 
              key={runs} 
              onClick={() => recordBall(runs)} 
              className="bg-gray-800 hover:bg-blue-900 border border-gray-700 hover:border-blue-500 active:bg-blue-800 text-2xl font-bold py-6 rounded-lg transition-all shadow-md"
            >
              {runs}
            </button>
          ))}
          <button className="col-span-2 bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-red-200 text-xl font-bold py-6 rounded-lg transition-all">
            WICKET
          </button>
          <button className="col-span-2 md:col-span-4 bg-yellow-900/30 hover:bg-yellow-800 border border-yellow-500/30 text-yellow-300 text-xl font-bold py-4 rounded-lg transition-all">
            EXTRAS
          </button>
        </div>

      </div>
    </main>
  )
}
