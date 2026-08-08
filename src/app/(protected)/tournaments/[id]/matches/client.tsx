"use client"

import React, { useState } from 'react'
import { CalendarDays, Plus, Filter, LayoutGrid, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { ScheduleMatchModal } from '@/features/matches/components/ScheduleMatchModal'
import Link from 'next/link'

type TournamentMatchesClientProps = {
  tournamentId: string
  initialMatches: any[]
  enrolledTeams: any[]
}

export function TournamentMatchesClient({ tournamentId, initialMatches, enrolledTeams }: TournamentMatchesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredMatches = initialMatches.filter(m => 
    m.team1?.name.toLowerCase().includes(search.toLowerCase()) || 
    m.team2?.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Fixtures & Results</h2>
          <p className="text-sm text-text-secondary">Manage matches for this tournament</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-2 pl-9 text-sm text-white focus:border-brand-primary outline-none"
            />
          </div>
          <Button variant="outline" className="gap-2 hidden sm:flex">
            <Filter size={16} /> Filter
          </Button>
          <Button variant="primary" className="gap-2 whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Schedule Match
          </Button>
        </div>
      </div>

      {initialMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-bg-elevated rounded-2xl bg-bg-surface/30 mt-8">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-primary/5">
            <CalendarDays size={40} className="text-brand-primary" />
          </div>
          <h3 className="text-xl font-black text-text-primary mb-2">No Matches Scheduled</h3>
          <p className="text-text-secondary max-w-md mb-8">
            Create your first fixture by selecting two teams enrolled in this tournament.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>Schedule First Match</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match) => (
            <Link key={match.id} href={`/matches/${match.id}/overview`} className="block group">
              <Card className="bg-bg-surface border-bg-elevated hover:border-brand-primary/50 transition-colors h-full">
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className="px-4 py-3 border-b border-bg-elevated flex justify-between items-center bg-[#0a0a0a]/50 rounded-t-xl">
                    <span className="text-xs font-bold text-text-secondary uppercase">{match.match_stage} • Match {match.match_number}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border
                      ${match.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        match.status === 'live' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}
                    `}>
                      {match.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                        <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-text-primary font-bold overflow-hidden shadow-inner border border-bg-elevated">
                           {match.team1?.logo_url ? <img src={match.team1.logo_url} className="w-full h-full object-cover"/> : match.team1?.short_name}
                        </div>
                        <span className="font-bold text-sm text-text-primary truncate w-full">{match.team1?.name}</span>
                      </div>
                      
                      <div className="text-xs font-black text-text-muted bg-bg-base px-2 py-1 rounded">VS</div>

                      <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                        <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-text-primary font-bold overflow-hidden shadow-inner border border-bg-elevated">
                           {match.team2?.logo_url ? <img src={match.team2.logo_url} className="w-full h-full object-cover"/> : match.team2?.short_name}
                        </div>
                        <span className="font-bold text-sm text-text-primary truncate w-full">{match.team2?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 border-t border-bg-elevated bg-[#0a0a0a]/30 rounded-b-xl flex justify-between items-center text-xs text-text-secondary">
                    <span>{new Date(match.scheduled_time).toLocaleDateString()} at {new Date(match.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="font-medium text-text-muted">{match.scheduled_overs} Overs</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <ScheduleMatchModal 
        tournamentId={tournamentId}
        enrolledTeams={enrolledTeams}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          // The router.push is handled in the server action response by the modal
        }}
      />
    </div>
  )
}
