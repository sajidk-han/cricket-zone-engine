import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Trophy, TrendingUp } from 'lucide-react'

interface FeaturedTeamCardProps {
  team: any
  orgSlug: string
}

export function FeaturedTeamCard({ team, orgSlug }: FeaturedTeamCardProps) {
  // Mocking rich data for now. We can join with tournament_statistics later.
  const stats = {
    ranking: Math.floor(Math.random() * 5) + 1,
    played: 12,
    won: 10,
    lost: 2,
    nrr: '+1.48',
    form: ['W', 'W', 'L', 'W', 'W']
  }

  return (
    <Link href={`/fanzone/${orgSlug}/teams/${team.slug || team.id}`} className="block group">
      <Card className="bg-gradient-to-br from-bg-surface to-bg-base border-border-dim hover:border-border-strong transition-all duration-300 overflow-hidden relative group-hover:-translate-y-1 group-hover:shadow-lg">
        {/* Top highlight bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardContent className="p-6">
          
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-bg-elevated to-bg-surface flex items-center justify-center overflow-hidden border border-border-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)] shrink-0">
              {team.logo_url ? (
                <img src={team.logo_url} alt={team.short_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <span className="text-xl font-black text-text-primary drop-shadow-sm">{team.short_name?.[0]}</span>
              )}
            </div>
            <div className="bg-brand-primary/20 text-brand-secondary border border-brand-primary/30 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm">
              <Trophy size={10} /> Rank #{stats.ranking}
            </div>
          </div>

          <h3 className="font-black text-lg text-text-primary mb-4 line-clamp-1 group-hover:text-brand-secondary transition-colors">{team.name}</h3>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
             <div className="bg-bg-elevated rounded py-2 border border-border-dim">
               <div className="text-[10px] text-text-secondary uppercase font-bold">P</div>
               <div className="text-sm font-black text-text-primary">{stats.played}</div>
             </div>
             <div className="bg-status-success/10 rounded py-2 border border-status-success/20">
               <div className="text-[10px] text-status-success uppercase font-bold">W</div>
               <div className="text-sm font-black text-status-success">{stats.won}</div>
             </div>
             <div className="bg-bg-elevated rounded py-2 border border-border-dim">
               <div className="text-[10px] text-text-secondary uppercase font-bold">NRR</div>
               <div className="text-sm font-black text-text-primary">{stats.nrr}</div>
             </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border-dim text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary font-medium">
               <TrendingUp size={14} className="text-brand-secondary" /> Form
            </div>
            <div className="flex gap-1">
              {stats.form.map((res, i) => (
                <span key={i} className={`w-5 h-5 flex items-center justify-center rounded-sm text-[9px] font-black
                  ${res === 'W' ? 'bg-status-success/20 text-status-success border border-status-success/30' : 
                    res === 'L' ? 'bg-status-danger/20 text-status-danger border border-status-danger/30' : 
                    'bg-bg-elevated text-text-secondary border border-border-dim'}`}
                >
                  {res}
                </span>
              ))}
            </div>
          </div>
          
        </CardContent>
      </Card>
    </Link>
  )
}
