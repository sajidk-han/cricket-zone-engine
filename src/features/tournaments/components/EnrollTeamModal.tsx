"use client"

import React, { useState, useEffect } from 'react'
import { Search, X, Loader2, Users } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { enrollTeam } from '@/app/actions/tournaments'
import { fetchTeams } from '@/app/actions/teams'
import { toast } from 'react-hot-toast'

type EnrollTeamModalProps = {
  tournamentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  alreadyEnrolledIds: string[]
}

export function EnrollTeamModal({ tournamentId, isOpen, onClose, onSuccess, alreadyEnrolledIds }: EnrollTeamModalProps) {
  const [teams, setTeams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [enrollingId, setEnrollingId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadTeams()
    }
  }, [isOpen])

  const loadTeams = async () => {
    setIsLoading(true)
    const res = await fetchTeams()
    if (res && Array.isArray(res)) {
      setTeams(res)
    }
    setIsLoading(false)
  }

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.short_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleEnroll = async (teamId: string) => {
    setEnrollingId(teamId)
    const res = await enrollTeam(tournamentId, teamId)
    setEnrollingId(null)
    
    if (res.success) {
      toast.success(res.message)
      onSuccess()
    } else {
      toast.error(res.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-bg-base border-bg-elevated shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-bg-elevated">
          <div>
            <h2 className="text-xl font-bold text-white">Enroll Teams</h2>
            <p className="text-sm text-text-secondary mt-1">Select teams from your organization to add to this tournament.</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-white rounded-full hover:bg-bg-elevated transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-bg-elevated bg-bg-surface/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search teams by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="flex justify-center p-8 text-brand-primary">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p>No teams found matching your search.</p>
            </div>
          ) : (
            filteredTeams.map((team) => {
              const isEnrolled = alreadyEnrolledIds.includes(team.id)
              const isEnrolling = enrollingId === team.id

              return (
                <div key={team.id} className="flex items-center justify-between p-4 rounded-xl border border-bg-elevated bg-bg-surface hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center font-bold text-white">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        team.short_name
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{team.name}</h4>
                      <p className="text-xs text-text-secondary">{team.short_name}</p>
                    </div>
                  </div>
                  
                  {isEnrolled ? (
                    <span className="px-3 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      Already Enrolled
                    </span>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEnroll(team.id)}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? <Loader2 size={16} className="animate-spin" /> : 'Enroll Team'}
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
