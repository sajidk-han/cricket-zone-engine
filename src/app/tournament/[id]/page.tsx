"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function TournamentDashboard() {
  const { id } = useParams()
  const [teamName, setTeamName] = useState('')
  const [city, setCity] = useState('')
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [id])

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', id)
    
    if (data) setTeams(data)
  }

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('teams')
      .insert([{ tournament_id: id, name: teamName, city }])

    setLoading(false)

    if (error) {
      alert("Database Error: " + error.message)
    } else {
      setTeamName('')
      setCity('')
      fetchTeams() // List refresh karne ke liye
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 p-10 font-sans text-white">
      <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-800 pb-4">
        Tournament Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Team Registration Form */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Register New Team</h2>
          <form onSubmit={handleAddTeam}>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Team Name</label>
              <input 
                type="text" required value={teamName}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500"
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">City / Region</label>
              <input 
                type="text" required value={city}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Adding Team...' : 'Add Team'}
            </button>
          </form>
        </div>

        {/* Registered Teams List */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Registered Teams</h2>
          {teams.length === 0 ? (
            <p className="text-yellow-500 bg-yellow-900/20 p-3 rounded text-sm">
              No teams registered in this tournament yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {teams.map((team) => (
                <li key={team.id} className="bg-gray-800 p-3 rounded flex justify-between items-center border border-gray-700">
                  <span className="font-semibold text-gray-200">{team.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">{team.city}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
