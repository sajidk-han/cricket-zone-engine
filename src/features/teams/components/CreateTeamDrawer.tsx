"use client"

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Drawer } from '@/shared/components/ui/Drawer'
import { createTeam } from '@/app/actions/teams'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function CreateTeamDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const res = await createTeam(formData)
      if (res && res.error) {
        toast.error(res.error)
      } else {
        toast.success('Team created successfully!')
        setIsOpen(false)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to create team')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Plus size={16} className="mr-2" /> Register Team
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Register New Team"
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input 
                name="name" 
                type="text" 
                required
                placeholder="e.g. Mumbai Indians"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Short Name (Abbreviation) <span className="text-red-500">*</span>
              </label>
              <input 
                name="shortName" 
                type="text" 
                required
                maxLength={4}
                placeholder="e.g. MI"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Team Logo URL
              </label>
              <input 
                name="logoUrl" 
                type="url" 
                placeholder="https://..."
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
              />
              <p className="text-xs text-text-muted mt-1">Upload strategy will be implemented later.</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-bg-elevated flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Create Team
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
