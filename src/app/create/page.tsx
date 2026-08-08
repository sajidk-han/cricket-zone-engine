"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateTournament() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('tournaments')
      .insert([{ name, location, status: 'upcoming' }])

    setLoading(false)

    if (error) {
      alert("Database Error: " + error.message)
    } else {
      router.push('/') 
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 p-10 font-sans text-text-primary flex justify-center items-center">
      <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-500 border-b border-gray-700 pb-2">Launch New Tournament</h2>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Tournament Name</label>
          <input 
            type="text" 
            required
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-text-primary outline-none focus:border-blue-500 transition-colors"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Location / Ground</label>
          <input 
            type="text" 
            required
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-text-primary outline-none focus:border-blue-500 transition-colors"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Initializing Database...' : 'Save & Initialize Database'}
        </button>
      </form>
    </main>
  )
}
