"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function TeamDashboard() {
  const { id } = useParams()
  const [playerName, setPlayerName] = useState('')
  const [role, setRole] = useState('batsman')
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [id])

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', id)
      .order('created_at', { ascending: true })
    
    if (data) setPlayers(data)
  }

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('players')
      .insert([{ team_id: id, name: playerName, role }])

    setLoading(false)

    if (error) {
      alert("Database Error: " + error.message)
    } else {
      setPlayerName('')
      fetchPlayers()
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 p-10 font-sans text-white">
      <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-800 pb-4">
        Squad Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Player Registration Form */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Draft New Player</h2>
          <form onSubmit={handleAddPlayer}>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Player Name</label>
              <input 
                type="text" required value={playerName}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500"
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">Playing Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500"
              >
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="all_rounder">All Rounder</option>
                <option value="wicket_keeper">Wicket Keeper</option>
              </select>
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Adding Player...' : 'Add Player to Squad'}
            </button>
          </form>
        </div>

        {/* Registered Players List */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Current Squad</h2>
          {players.length === 0 ? (
            <p className="text-yellow-500 bg-yellow-900/20 p-3 rounded text-sm">
              No players in this squad yet. Add at least 3 to play a match.
            </p>
          ) : (
            <ul className="space-y-3">
              {players.map((player) => (
                <li key={player.id} className="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
                  <span className="font-semibold text-gray-200">{player.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded uppercase tracking-wider">{player.role.replace('_', ' ')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
