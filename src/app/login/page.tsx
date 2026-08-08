"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    try {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        router.push('/dashboard')
      }
    } catch (e: any) {
      console.error('Login error:', e)
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-black text-brand-primary tracking-tighter mb-2 flex justify-center items-center gap-2">
              <span className="text-4xl">🏏</span> CricketZone
            </h1>
            <p className="text-text-secondary text-sm">Enterprise Scoring Engine</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input 
                name="email" 
                type="email" 
                label="Email Address" 
                placeholder="admin@cricketzone.com" 
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
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-xs text-text-muted mt-6 space-y-2 relative z-50">
            <p>Don't have an organization account?</p>
            <a href="/register" className="text-brand-primary hover:underline font-bold block p-2">
              Register Your Team / Organization
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
