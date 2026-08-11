import React from 'react'
import { createClient } from '@/lib/supabase-server'
import { LiveStreamSettingsForm } from '@/features/match-engine/components/settings/LiveStreamSettingsForm'
import { notFound, redirect } from 'next/navigation'

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: match } = await supabase
    .from('matches')
    .select('id, live_stream_url, org_id')
    .eq('id', resolvedParams.id)
    .single()

  if (!match) notFound()

  // Fetch user role
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'viewer'
  if (user) {
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = getAdminClient()
      const { data: dbUser } = await adminClient.from('users').select('id').eq('auth_id', user.id).single()
      if (dbUser) {
        const { data: member } = await adminClient
          .from('organization_members')
          .select('role')
          .eq('user_id', dbUser.id)
          .eq('org_id', match.org_id)
          .single()
        if (member) userRole = member.role
      }
    } catch(e) {}
  }

  // Protect route from organizers and viewers
  if (['viewer', 'organizer'].includes(userRole)) {
    redirect(`/matches/${match.id}/overview`)
  }

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
