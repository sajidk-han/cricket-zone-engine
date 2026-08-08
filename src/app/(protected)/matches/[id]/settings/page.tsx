import React from 'react'
import { createClient } from '@/lib/supabase-server'
import { LiveStreamSettingsForm } from '@/features/match-engine/components/settings/LiveStreamSettingsForm'
import { notFound } from 'next/navigation'

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: match } = await supabase
    .from('matches')
    .select('id, live_stream_url')
    .eq('id', resolvedParams.id)
    .single()

  if (!match) notFound()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-wider uppercase mb-2">Match Settings</h1>
        <p className="text-text-secondary">Configure technical parameters, live streaming, and advanced options for this match.</p>
      </div>

      <LiveStreamSettingsForm matchId={match.id} initialUrl={match.live_stream_url} />
      
      {/* Future Settings can go below */}
    </div>
  )
}
