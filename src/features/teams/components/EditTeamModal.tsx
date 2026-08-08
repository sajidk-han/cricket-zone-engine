"use client"

import React, { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateTeam, updateTeamLogo, uploadTeamLogo } from '@/app/actions/teams'
import { ImageUpload, ImageUploadHandle } from '@/shared/components/ui/ImageUpload'

export function EditTeamModal({ team }: { team: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const uploadRef = React.useRef<ImageUploadHandle>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const res = await updateTeam(team.id, formData)
      
      if (res.success) {
        // Now handle image upload if a new file was selected
        if (uploadRef.current?.hasFile()) {
          try {
            await uploadRef.current.upload(
              `${team.org_id}/${team.id}`, 
              'logo.webp'
            )
          } catch (uploadError: any) {
            toast.error("Team updated, but logo upload failed: " + uploadError.message)
          }
        }
        
        toast.success(res.message)
        setIsOpen(false)
        // Reload to show new logo from server
        window.location.reload()
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error('Failed to update team')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Edit Team
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-surface border border-bg-elevated rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-bg-elevated flex justify-between items-center bg-bg-base/50">
              <h3 className="text-lg font-bold text-white">Edit Team</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name" 
                    type="text" 
                    required
                    defaultValue={team.name}
                    placeholder="e.g. Kaardan"
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Short Name (e.g. KRD) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="shortName" 
                    type="text" 
                    required
                    maxLength={4}
                    defaultValue={team.short_name}
                    placeholder="KRD"
                    className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary uppercase"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Team Logo
                  </label>
                  <ImageUpload 
                    ref={uploadRef}
                    bucketName="team-logos"
                    autoUpload={false}
                    currentImageUrl={team.logo_url}
                    serverUploadAction={uploadTeamLogo}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" isLoading={isSubmitting}>
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
