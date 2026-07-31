"use client"

import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import Link from 'next/link'
import { createTeam } from '@/app/actions/teams'
import { useFormStatus } from 'react-dom'

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teams" className="text-text-secondary hover:text-white transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Register Team</h1>
      </div>

      <form ref={formRef} action={async (formData) => {
        await createTeam(formData)
        window.location.href = '/teams'
      }}>
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
              <label className="block text-sm font-medium text-text-secondary">Logo URL</label>
              <Input 
                name="logoUrl"
                placeholder="https://example.com/logo.png" 
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

