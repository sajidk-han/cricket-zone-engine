"use client"

import React, { useState, useEffect } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Drawer } from '@/shared/components/ui/Drawer'
import { toast } from 'sonner'
import { assignPlayerToTeam } from '@/app/actions/teams'
import { fetchOrganizationPlayers } from '@/app/actions/players'

export function AssignPlayerModal({ teamId, teamName }: { teamId: string, teamName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [players, setPlayers] = useState<any[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadPlayers()
    }
  }, [isOpen])

  const loadPlayers = async () => {
    setLoadingPlayers(true)
    try {
      const data = await fetchOrganizationPlayers()
      setPlayers(data)
    } catch (err) {
      toast.error('Failed to load players')
    } finally {
      setLoadingPlayers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    
    try {
      await assignPlayerToTeam(formData)
      toast.success('Player assigned to team successfully!')
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign player')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        <UserPlus size={16} className="mr-2" /> Add Player to {teamName}
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Assign Player to Team"
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-secondary p-3 rounded-lg text-xs leading-relaxed">
            Select a player from your Global Player Pool to assign to <strong>{teamName}</strong>. If the player doesn't exist, please add them to the pool first.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Select Player <span className="text-red-500">*</span>
              </label>
              <select 
                name="playerId" 
                required
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                disabled={loadingPlayers}
              >
                <option value="">{loadingPlayers ? 'Loading players...' : 'Select a player...'}</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.primary_role || 'Player'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Team Role
                </label>
                <select 
                  name="role" 
                  className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="Player">Player</option>
                  <option value="Captain">Captain</option>
                  <option value="Vice Captain">Vice Captain</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Jersey Number (Optional)
                </label>
                <input 
                  name="jersey" 
                  type="number"
                  min="0"
                  max="999"
                  placeholder="e.g. 56"
                  className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-bg-elevated flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Assign to Team
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
