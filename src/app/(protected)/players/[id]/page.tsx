import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { User, Activity, Edit3, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { EditPlayerForm } from '@/features/players/components/EditPlayerForm'

import { OptimizedImage } from '@/features/fanzone/components/OptimizedImage'
import { EditableAvatar } from '@/features/players/components/EditableAvatar'

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !player) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-text-muted overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link href="/players" className="hover:text-text-primary transition-colors">Players Directory</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-text-primary font-medium">{player.full_name}</span>
      </div>

      <Card className="bg-gradient-to-br from-bg-surface to-bg-base border-bg-elevated relative overflow-hidden mt-6">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <EditableAvatar 
              playerId={player.id} 
              orgId={player.org_id} 
              currentAvatarUrl={player.avatar_url} 
              playerName={player.full_name} 
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">{player.full_name}</h1>
              <Link 
                href={`/fanzone/default-org/players/${player.slug}`}
                className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-full font-medium text-sm transition-colors"
              >
                View Public Profile <ExternalLink size={14} />
              </Link>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                <div className="bg-bg-elevated/50 px-4 py-2 rounded-lg border border-bg-elevated flex items-center gap-2">
                  <Activity size={16} className="text-text-secondary"/>
                  <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Batting</div>
                    <div className="text-sm font-medium text-text-primary">{player.batting_style || 'N/A'}</div>
                  </div>
                </div>
                <div className="bg-bg-elevated/50 px-4 py-2 rounded-lg border border-bg-elevated flex items-center gap-2">
                  <Activity size={16} className="text-text-secondary"/>
                  <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Bowling</div>
                    <div className="text-sm font-medium text-text-primary">{player.bowling_style || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditPlayerForm player={player} />
    </div>
  )
}
