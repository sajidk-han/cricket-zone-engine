import React from 'react'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { FeaturedTeamCard } from '@/features/fanzone/components/FeaturedTeamCard'

export const revalidate = 60

async function fetchOrgTeams(orgSlug: string) {
  const supabase = await createClient()
  
  // 1. Get org id
  const { data: org } = await supabase.from('organizations').select('id').eq('slug', orgSlug).single()
  if (!org) return []

  // 2. Fetch teams
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('org_id', org.id)
    .order('name', { ascending: true })

  return teams || []
}

export default async function PublicTeamsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params
  const teams = await fetchOrgTeams(orgSlug)

  return (
    <div className="min-h-screen font-sans space-y-12 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-elevated border border-border-dim text-xs font-bold tracking-widest text-text-secondary uppercase mb-2">
          <Users size={14} className="text-green-400" />
          Participating Squads
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase">
          Teams & <span className="text-green-400">Franchises</span>
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto px-4 md:px-0">
        {teams.map((team: any) => (
          <div key={team.id} className="w-full max-w-[320px] sm:max-w-[350px]">
            <FeaturedTeamCard team={team} orgSlug={orgSlug} />
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-32 border border-border-dim rounded-[var(--radius-xl)] bg-bg-surface flex flex-col items-center gap-4">
          <Users size={48} className="text-text-muted/30" />
          <h3 className="text-xl font-bold text-text-secondary">No Teams Found</h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto">There are no teams registered for this organization yet.</p>
        </div>
      )}
    </div>
  )
}
