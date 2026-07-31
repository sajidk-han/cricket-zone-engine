"use client"

import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import Link from 'next/link'
import { createTournament } from '@/app/actions/tournaments'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button variant="primary" type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Tournament'}
    </Button>
  )
}

export default function NewTournamentPage() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tournaments" className="text-text-secondary hover:text-white transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Create New Tournament</h1>
      </div>

      <form ref={formRef} action={async (formData) => {
        await createTournament(formData)
        // Redirection is handled by the framework or we can do it here if we want to avoid client router issues.
        // But revalidatePath is used, so we can just let it redirect via the Server Action if we added redirect() there.
        // Since we didn't add redirect() in the action, let's redirect on client side after success:
        window.location.href = '/tournaments'
      }}>
        <Card>
          <CardHeader>
            <CardTitle>Tournament Details</CardTitle>
            <p className="text-sm text-text-secondary mt-1">Provide the core information for your new tournament.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6">
              <Input 
                name="name"
                label="Tournament Name" 
                placeholder="e.g. Summer Championship 2026" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                name="startDate"
                label="Start Date" 
                type="date" 
                required 
              />
              <Input 
                name="endDate"
                label="End Date" 
                type="date" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-secondary">Match Type</label>
                <select className="w-full px-3 py-2 bg-bg-base border border-bg-elevated rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
                  <option value="t20">T20 (20 Overs)</option>
                  <option value="t10">T10 (10 Overs)</option>
                  <option value="odi">One Day (50 Overs)</option>
                  <option value="test">Test Match</option>
                  <option value="custom">Custom (e.g. 100 balls)</option>
                </select>
              </div>

              <Input 
                name="location"
                label="City / Location" 
                placeholder="e.g. Dubai, UAE" 
              />
            </div>

          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end gap-4">
          <Link href="/tournaments">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

