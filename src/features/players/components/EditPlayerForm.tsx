"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { toast } from 'react-hot-toast'
import { updatePlayer } from '@/app/actions/players'

type EditPlayerFormProps = {
  player: any
}

export function EditPlayerForm({ player }: EditPlayerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)

      const res = await updatePlayer(player.id, formData)
      
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error('Failed to update player')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-bg-surface border-bg-elevated">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input 
              name="fullName" 
              type="text" 
              required
              defaultValue={player.full_name}
              className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Primary Role <span className="text-red-500">*</span>
              </label>
              <select 
                name="role" 
                required
                defaultValue={player.primary_role || 'batsman'}
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="allrounder">All-rounder</option>
                <option value="wicketkeeper">Wicket Keeper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Leadership Role
              </label>
              <select 
                name="leadershipRole" 
                defaultValue={player.leadership_role || 'none'}
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="none">None</option>
                <option value="Captain">Captain</option>
                <option value="Vice Captain">Vice Captain</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Batting Style
              </label>
              <select 
                name="battingStyle" 
                defaultValue={player.batting_style || 'none'}
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="none">None</option>
                <option value="Right-hand bat">Right-hand bat</option>
                <option value="Left-hand bat">Left-hand bat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Bowling Style
              </label>
              <select 
                name="bowlingStyle" 
                defaultValue={player.bowling_style || 'none'}
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="none">None</option>
                <option value="Right-arm fast">Right-arm fast</option>
                <option value="Right-arm spin">Right-arm spin</option>
                <option value="Left-arm fast">Left-arm fast</option>
                <option value="Left-arm spin">Left-arm spin</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
