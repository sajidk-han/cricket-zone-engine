"use client"

import React, { useState } from 'react'
import { X, Loader2, Calendar } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { scheduleMatch } from '@/app/actions/matches'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type ScheduleMatchModalProps = {
  tournamentId: string
  enrolledTeams: any[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ScheduleMatchModal({ tournamentId, enrolledTeams, isOpen, onClose, onSuccess }: ScheduleMatchModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    scheduled_at: '',
    match_type: 't20',
    scheduled_overs: 20
  })

  if (!isOpen) return null

  const validTeams = enrolledTeams.map(t => t.team)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.team1_id === formData.team2_id) {
      toast.error("Team 1 and Team 2 cannot be the same")
      return
    }

    if (!formData.scheduled_at) {
      toast.error("Please select a valid date and time")
      return
    }

    setIsLoading(true)
    
    const isoDate = new Date(formData.scheduled_at).toISOString()

    const payload = {
      tournament_id: tournamentId,
      team1_id: formData.team1_id,
      team2_id: formData.team2_id,
      scheduled_at: isoDate,
      match_type: formData.match_type as 't10' | 't20' | 'odi' | 'test' | 'custom',
      scheduled_overs: Number(formData.scheduled_overs),
      settings: {
        overs: Number(formData.scheduled_overs),
        matchFormat: formData.match_type,
        powerplayOvers: formData.match_type === 't20' ? 6 : formData.match_type === 't10' ? 3 : 10,
        superOver: true,
        dls: true,
        ballType: 'hard_tennis',
        pitchType: 'mat'
      }
    }

    const res = await scheduleMatch(payload as any)
    
    if (res.success) {
      toast.success("Match scheduled successfully!")
      onSuccess()
      // Enterprise Redirect to Match Workspace
      router.push(`/matches/${res.data.id}/overview`)
    } else {
      toast.error(res.message || "Failed to schedule match")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-[#0a0a0a] border-bg-elevated shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-bg-elevated bg-bg-base rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Fixture</h2>
              <p className="text-sm text-text-secondary mt-1">Set up a new match between enrolled teams.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-white rounded-full hover:bg-bg-elevated transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {validTeams.length < 2 ? (
            <div className="text-center py-12">
              <p className="text-red-400 font-bold mb-2">Not enough teams</p>
              <p className="text-text-secondary text-sm">You need at least 2 teams enrolled in this tournament to schedule a match.</p>
            </div>
          ) : (
            <form id="schedule-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Team 1 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Team 1 (Home)</label>
                  <select 
                    required
                    value={formData.team1_id}
                    onChange={(e) => setFormData({...formData, team1_id: e.target.value})}
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="" disabled>Select Team</option>
                    {validTeams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === formData.team2_id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Team 2 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Team 2 (Away)</label>
                  <select 
                    required
                    value={formData.team2_id}
                    onChange={(e) => setFormData({...formData, team2_id: e.target.value})}
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="" disabled>Select Team</option>
                    {validTeams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === formData.team1_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary outline-none [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Format</label>
                  <select 
                    value={formData.match_type}
                    onChange={(e) => {
                      const type = e.target.value
                      let overs = 20
                      if (type === 't10') overs = 10
                      if (type === 'odi') overs = 50
                      setFormData({...formData, match_type: type, scheduled_overs: overs})
                    }}
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="t10">T10</option>
                    <option value="t20">T20</option>
                    <option value="odi">ODI (50 Overs)</option>
                    <option value="custom">Custom Format</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-bg-elevated bg-bg-base rounded-b-xl flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="schedule-form"
            disabled={isLoading || validTeams.length < 2}
            className="w-40"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Fixture'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
