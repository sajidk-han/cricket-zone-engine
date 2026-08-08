"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { createTournament } from '@/app/actions/tournaments'
import { CreateTournamentInput } from '@/features/tournaments/schemas'
import { toast } from 'react-hot-toast'

export default function NewTournamentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateTournamentInput>({
    name: '',
    start_date: '',
    end_date: '',
    settings: {
      overs_per_match: 20,
      match_format: 't20',
      win_points: 2,
      tie_points: 1,
      no_result_points: 1,
      super_over_enabled: true,
      dls_enabled: false,
      allow_player_transfers: false,
      max_squad_size: 15,
      max_playing_xi: 11,
      registration_deadline: null,
      logo_url: null
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await createTournament(formData)
      if (res.success && res.data) {
        toast.success(res.message)
        // Rule 9: Tournament Workspace Redirect
        router.push(`/tournaments/${res.data.id}/dashboard`)
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/tournaments" className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Back to Tournaments
      </Link>
      
      <div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Create Tournament</h1>
        <p className="text-text-secondary mt-1">Configure your new tournament settings. You can change these later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-bg-surface border-bg-elevated">
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Tournament Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Summer T20 District Cup"
                className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Start Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="date" 
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                    className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">End Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="date" 
                    required
                    value={formData.end_date}
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                    className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border-bg-elevated">
          <CardContent className="p-6">
             <h3 className="text-lg font-bold text-text-primary mb-4">Basic Settings</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Match Format</label>
                  <select 
                    value={formData.settings?.match_format}
                    onChange={e => setFormData({...formData, settings: {...formData.settings!, match_format: e.target.value as any}})}
                    className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="t10">T10</option>
                    <option value="t20">T20</option>
                    <option value="odi">One Day (ODI)</option>
                    <option value="test">Test Match</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Overs Per Match</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={formData.settings?.overs_per_match}
                    onChange={e => setFormData({...formData, settings: {...formData.settings!, overs_per_match: parseInt(e.target.value)}})}
                    className="w-full bg-[#050505] border border-bg-elevated rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                  />
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/tournaments">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button variant="primary" type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="mr-2" /> Create Workspace</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
