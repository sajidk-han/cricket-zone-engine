"use client"

import React, { useState, useTransition } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateTeamPlayer, removeTeamPlayer } from '@/app/actions/teams'

export function TeamPlayerActions({ player, teamId }: { player: any, teamId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('teamPlayerId', player.team_player_id)
      formData.append('teamId', teamId)
      
      const res = await updateTeamPlayer(formData)
      if (res.success) {
        toast.success(res.message)
        setIsOpen(false)
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error('Failed to update player')
    } finally {
      setIsEditing(false)
    }
  }

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${player.name} from the team?`)) {
      startTransition(async () => {
        const res = await removeTeamPlayer(player.team_player_id, teamId)
        if (res.success) {
          toast.success(res.message)
        } else {
          toast.error(res.message)
        }
      })
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-text-muted hover:text-white"
          onClick={() => setIsOpen(true)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-400 hover:text-red-300"
          onClick={handleRemove}
          isLoading={isPending}
        >
          Remove
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-surface border border-bg-elevated rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-bg-elevated flex justify-between items-center bg-bg-base/50">
              <h3 className="text-lg font-bold text-white">Edit Team Role</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Team Role
                  </label>
                  <select 
                    name="role" 
                    defaultValue={player.role || 'Player'}
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
                    placeholder="e.g. 10"
                    defaultValue={player.jersey || ''}
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" isLoading={isEditing}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
