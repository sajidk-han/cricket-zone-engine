import React from 'react'
import Link from 'next/link'
import { getMatchSummary } from '@/app/actions/matches'
import { LayoutDashboard, Users, Activity, FileText, Settings, ChevronRight, Settings2, ShieldCheck, History } from 'lucide-react'
import { notFound } from 'next/navigation'

import { WorkspaceTabs } from './WorkspaceTabs'

export default async function MatchWorkspaceLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const res = await getMatchSummary(resolvedParams.id)
  
  if (!res.success || !res.data) {
    notFound()
  }

  const match = res.data

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 overflow-x-hidden pb-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-text-muted overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link href="/tournaments" className="hover:text-text-primary transition-colors">Tournaments</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link href={`/tournaments/${match.tournament.id}`} className="hover:text-text-primary transition-colors">{match.tournament.name}</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-text-primary font-medium">Match Workspace</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Match Workspace Header */}
        <div>
          <h1 className="text-3xl font-black text-text-primary">{match.team1.name} vs {match.team2.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border
              ${match.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                match.status === 'live' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}
            `}>
              {match.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-text-secondary">{match.match_type.toUpperCase()} • {match.scheduled_overs} Overs</span>
            {match.ground && (
              <span className="text-sm text-text-secondary">• {match.ground.name}</span>
            )}
          </div>
        </div>

        {/* Enterprise Match Route Structure (Rule 6) */}
        <WorkspaceTabs matchId={match.id} />

        {/* Workspace Content */}
        <div className="py-2">
          {children}
        </div>
      </div>
    </div>
  )
}

