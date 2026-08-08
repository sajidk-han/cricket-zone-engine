import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { ChevronRight } from 'lucide-react'

interface PublicMatchCardProps {
  match: any
  orgSlug: string
  compact?: boolean
}

export function PublicMatchCard({ match, orgSlug, compact = false }: PublicMatchCardProps) {
  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'
  
  const team1 = match.team1 || { name: 'TBA', short_name: 'TBA' }
  const team2 = match.team2 || { name: 'TBA', short_name: 'TBA' }
  const stats = match.match_statistics || {}

  const t1Runs = stats.team1_runs || 0
  const t1Wickets = stats.team1_wickets || 0
  const t1Overs = stats.team1_overs || 0

  const t2Runs = stats.team2_runs || 0
  const t2Wickets = stats.team2_wickets || 0
  const t2Overs = stats.team2_overs || 0

  return (
    <Link href={`/fanzone/${orgSlug}/matches/${match.slug || match.id}`} className="block group">
      <Card className="bg-bg-surface border-bg-elevated hover:border-brand-primary/50 transition-all duration-300 overflow-hidden relative group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-brand-primary/5">
        
        {isLive && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
        )}

        <CardContent className={`p-5 ${compact ? 'p-4' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest truncate max-w-[150px]">
              {match.tournament?.name || 'Tournament'}
            </span>
            {isLive ? (
              <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
              </span>
            ) : isCompleted ? (
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Result</span>
            ) : (
              <span className="text-[10px] font-bold text-text-secondary bg-bg-elevated px-2 py-0.5 rounded uppercase tracking-wider">Upcoming</span>
            )}
          </div>

          <div className="space-y-3">
            {/* Team 1 Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden border border-white/5">
                  {team1.logo_url ? <img src={team1.logo_url} alt={team1.short_name} className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-text-muted">{team1.short_name?.[0]}</span>}
                </div>
                <span className="font-bold text-white text-sm sm:text-base">{team1.name}</span>
              </div>
              {(isLive || isCompleted) ? (
                <div className="text-right">
                  <div className="font-black text-white">{t1Runs}/{t1Wickets}</div>
                  {!compact && <div className="text-[10px] text-text-muted">{t1Overs} ov</div>}
                </div>
              ) : (
                 <div className="text-sm font-black text-text-muted">--</div>
              )}
            </div>

            {/* Team 2 Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden border border-white/5">
                  {team2.logo_url ? <img src={team2.logo_url} alt={team2.short_name} className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-text-muted">{team2.short_name?.[0]}</span>}
                </div>
                <span className="font-bold text-white text-sm sm:text-base">{team2.name}</span>
              </div>
              {(isLive || isCompleted) ? (
                <div className="text-right">
                  <div className="font-black text-white">{t2Runs}/{t2Wickets}</div>
                  {!compact && <div className="text-[10px] text-text-muted">{t2Overs} ov</div>}
                </div>
              ) : (
                 <div className="text-sm font-black text-text-muted">--</div>
              )}
            </div>
          </div>

          {/* Footer Context */}
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-brand-primary font-medium truncate pr-2">
              {match.result_reason 
                ? `${match.winning_team?.name || 'TBA'} won by ${match.result_reason}` 
                : isLive && stats.target_score 
                ? `Target: ${stats.target_score}` 
                : 'Yet to bat'}
            </span>
            <ChevronRight size={14} className="text-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
          
        </CardContent>
      </Card>
    </Link>
  )
}
