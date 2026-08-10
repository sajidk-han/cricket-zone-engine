"use client"

import React, { useState, useRef } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Drawer } from '@/shared/components/ui/Drawer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createPlayer, uploadPlayerAvatar, updatePlayer } from '@/app/actions/players'
import { ImageUpload, ImageUploadHandle } from '@/shared/components/ui/ImageUpload'

export function CreatePlayerDrawer({ 
  trigger,
  open,
  onOpenChange
}: { 
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const imageUploadRef = useRef<ImageUploadHandle>(null)

  const isOpen = open !== undefined ? open : internalIsOpen
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val)
    setInternalIsOpen(val)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // 1. Create player first
      const res = await createPlayer(formData)
      
      if (res.success && res.playerId && res.orgId) {
        // 2. If there's an image, upload it
        if (imageUploadRef.current?.hasFile()) {
          const publicUrl = await imageUploadRef.current.upload(res.orgId, res.playerId)
          if (publicUrl) {
            // 3. Update player with avatar URL
            const updateForm = new FormData()
            updateForm.append('fullName', formData.get('fullName') as string)
            updateForm.append('role', formData.get('role') as string)
            updateForm.append('battingStyle', formData.get('battingStyle') as string)
            updateForm.append('bowlingStyle', formData.get('bowlingStyle') as string)
            updateForm.append('avatarUrl', publicUrl)
            
            await updatePlayer(res.playerId, updateForm)
          }
        }
        
        toast.success(res.message)
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error('Failed to register player')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button variant="primary">
            <UserPlus size={16} className="mr-2" /> Add Player
          </Button>
        )}
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Register New Player"
        position="right"
        size="md"
      >
        <form key={isOpen ? 'open' : 'closed'} onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-900/20 border border-blue-500/30 text-blue-400 p-3 rounded-lg text-xs leading-relaxed">
            <strong>Note:</strong> Players registered here are added to your <strong>Global Player Pool</strong>. You can assign them to specific teams from the Team Dashboard.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Player Photo
              </label>
              <ImageUpload
                ref={imageUploadRef}
                bucketName="player-avatars"
                serverUploadAction={uploadPlayerAvatar}
                className="w-32 h-32 mx-auto rounded-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                name="fullName" 
                type="text" 
                required
                placeholder="e.g. Babar Azam"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Player Role <span className="text-red-500">*</span>
              </label>
              <select 
                name="role" 
                required
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="allrounder">All-rounder</option>
                <option value="wicketkeeper">Wicket Keeper</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Batting Style
                </label>
                <select 
                  name="battingStyle" 
                  className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="right">Right-hand bat</option>
                  <option value="left">Left-hand bat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Bowling Style
                </label>
                <select 
                  name="bowlingStyle" 
                  className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="none">None</option>
                  <option value="right_fast">Right-arm fast</option>
                  <option value="right_spin">Right-arm spin</option>
                  <option value="left_fast">Left-arm fast</option>
                  <option value="left_spin">Left-arm spin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Age
              </label>
              <input 
                name="age" 
                type="number"
                min="10"
                max="80"
                placeholder="e.g. 24"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          
          <div className="pt-6 border-t border-bg-elevated flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Add Player
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
