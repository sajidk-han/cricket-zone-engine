"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function MatchSetup() {
  const { id } = useParams()
  const [teams, setTeams] = useState<any[]>([])
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [tossWinner, setTossWinner] = useState('')
  const [tossDecision, setTossDecision] = useState('bat')
  const [loading, setLoading] = useState(false)
  const [matchId, setMatchId] = useState<string | null>(null)

  useEffect(() => {
    fetchTeams()
  }, [id])

  const fetchTeams = async () => {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', id)
    
    if (data) setTeams(data)
  }

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!team1 || !team2) return alert("Select both teams")
    if (team1 === team2) return alert("A team cannot play against itself. Fix your selection.")
    if (!tossWinner) return alert("Select who won the toss.")

    setLoading(true)

    // Insert match into database
    const { data, error } = await supabase
      .from('matches')
      .insert([{ 
        tournament_id: id, 
        team1_id: team1, 
        team2_id: team2, 
        toss_winner_id: tossWinner, 
        toss_decision: tossDecision,
        status: 'live' 
      }])
      .select()

    setLoading(false)

    if (error) {
      alert("Database Error: " + error.message)
    } else if (data && data.length > 0) {
      setMatchId(data[0].id)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 p-10 font-sans text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-800 pb-4 w-full max-w-2xl text-center">
        Initialize New Match
      </h1>

      {matchId ? (
        <div className="bg-green-900/40 border border-green-500 p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Match Instance Created Successfully!</h2>
          <p className="text-gray-300 mb-2">The database has locked this match state.</p>
          <p className="text-sm font-mono text-gray-500 bg-black p-3 rounded mb-6">Match ID: {matchId}</p>
          <p className="text-yellow-500 text-sm">System is now ready for the Live Scoring Dashboard module.</p>
        </div>
      ) : (
        <form onSubmit={handleCreateMatch} className="bg-gray-900 border border-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Team A</label>
              <select required value={team1} onChange={(e) => setTeam1(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500">
                <option value="">-- Select Team --</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Team B</label>
              <select required value={team2} onChange={(e) => setTeam2(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500">
                <option value="">-- Select Team --</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mb-8">
            <h3 className="text-lg text-gray-300 mb-4">Toss Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Toss Winner</label>
                <select value={tossWinner} onChange={(e) => setTossWinner(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500">
                  <option value="">-- Select Winner --</option>
                  {team1 && <option value={team1}>{teams.find(t => t.id === team1)?.name || 'Team A'}</option>}
                  {team2 && <option value={team2}>{teams.find(t => t.id === team2)?.name || 'Team B'}</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Elected To</label>
                <select value={tossDecision} onChange={(e) => setTossDecision(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white outline-none focus:border-blue-500">
                  <option value="bat">Bat First</option>
                  <option value="bowl">Bowl First</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50">
            {loading ? 'Locking Match Details...' : 'Initialize Match'}
          </button>
        </form>
      )}
    </main>
  )
}
