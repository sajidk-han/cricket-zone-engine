"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { registerOrganization } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { LogoIcon } from '@/shared/components/LogoIcon'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    try {
      const result = await registerOrganization(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
        // Optionally redirect after a few seconds or let them click to login
        setTimeout(() => router.push('/dashboard'), 3000)
      }
    } catch (e: any) {
      console.error('Registration error:', e)
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base p-4 relative overflow-hidden">
        <Card className="w-full max-w-md z-10 border-green-500/50 bg-green-950/20 backdrop-blur-xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h2 className="text-2xl font-bold text-green-400">Registration Complete!</h2>
            <p className="text-text-secondary">Your organization has been created and is pending approval from the Super Admin.</p>
            <p className="text-sm text-text-muted">Redirecting to your workspace...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-brand-primary blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-900 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md z-10 border-bg-elevated/50 bg-bg-surface/80 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-brand-primary tracking-tighter mb-2 flex justify-center items-center gap-3">
              <LogoIcon size={40} /> CricketZone
            </h1>
            <p className="text-text-secondary text-sm">Register your Organization</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input 
                name="orgName" 
                type="text" 
                label="Team / Organization Name" 
                placeholder="e.g. Peshawar Zalmi" 
                required 
              />
              <Input 
                name="fullName" 
                type="text" 
                label="Your Full Name" 
                placeholder="John Doe" 
                required 
              />
              <Input 
                name="email" 
                type="email" 
                label="Admin Email Address" 
                placeholder="admin@team.com" 
                required 
              />
              <Input 
                name="password" 
                type="password" 
                label="Password" 
                placeholder="••••••••" 
                required 
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button variant="primary" type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
            
          <div className="text-center text-xs text-text-muted mt-6 space-y-2 relative z-50">
            <p>Already have an account?</p>
            <a href="/login" className="text-brand-primary hover:underline font-bold block p-2">
              Sign In Instead
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
