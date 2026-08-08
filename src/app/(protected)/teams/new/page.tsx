"use client"

import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import Link from 'next/link'
import { createTeam, updateTeamLogo } from '@/app/actions/teams'
import { useFormStatus } from 'react-dom'
import { ImageUpload, ImageUploadHandle } from '@/shared/components/ui/ImageUpload'
import { toast } from 'react-hot-toast'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button variant="primary" type="submit" disabled={pending}>
      {pending ? 'Registering...' : 'Register Team'}
    </Button>
  )
}

export default function NewTeamPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const uploadRef = useRef<ImageUploadHandle>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      // 1. Create Team first
      const team = await createTeam(formData)

      // 2. Upload Logo if a file was selected
      if (uploadRef.current?.hasFile()) {
        try {
          const publicUrl = await uploadRef.current.upload(
            `${team.org_id}/${team.id}`, 
            'logo.webp'
          )
          if (publicUrl) {
            await updateTeamLogo(team.id, publicUrl)
          }
        } catch (uploadError: any) {
          toast.error("Team created, but logo upload failed: " + uploadError.message)
        }
      }
      
      window.location.href = '/teams'
    } catch (error: any) {
      toast.error(error.message || "Failed to create team")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teams" className="text-text-secondary hover:text-text-primary transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Register Team</h1>
      </div>

      <form ref={formRef} action={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Team Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6">
              <Input 
                name="name"
                label="Team Name" 
                placeholder="e.g. Lahore Eagles" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                name="shortName"
                label="Short Name (Max 4 chars)" 
                placeholder="e.g. LHE" 
                maxLength={4}
                required 
              />
              <Input 
                name="managerName"
                label="Manager / Owner Name" 
                placeholder="Optional" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Team Logo</label>
              <ImageUpload 
                ref={uploadRef}
                bucketName="team-logos"
                autoUpload={false} // Defer upload until form submit
              />
            </div>

          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end gap-4">
          <Link href="/teams">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

