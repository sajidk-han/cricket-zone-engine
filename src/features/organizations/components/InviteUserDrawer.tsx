"use client"

import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Drawer } from '@/shared/components/ui/Drawer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function InviteUserDrawer({ 
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
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast.success('Invitation sent successfully!')
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast.error('Failed to send invite')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button variant="primary">
            <Mail size={16} className="mr-2" /> Invite User
          </Button>
        )}
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Invite Team Member"
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                name="email" 
                type="email" 
                required
                placeholder="colleague@example.com"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Role
              </label>
              <select 
                name="role" 
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="manager">Manager</option>
                <option value="scorer">Scorer</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 border-t border-bg-elevated flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Send Invite
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
