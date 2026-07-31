"use client"

import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Drawer } from '@/shared/components/ui/Drawer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

  const isOpen = open !== undefined ? open : internalIsOpen
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val)
    setInternalIsOpen(val)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Mock API call for now (until players table logic is fully wired)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.success('Player registered successfully!')
      setIsOpen(false)
      router.refresh()
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                name="name" 
                type="text" 
                required
                placeholder="e.g. Babar Azam"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
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
                Date of Birth
              </label>
              <input 
                name="dob" 
                type="date"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                style={{ colorScheme: 'dark' }}
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
