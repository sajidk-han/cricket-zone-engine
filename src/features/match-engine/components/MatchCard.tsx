'use client' // Force JIT recompile

import React, { useState } from 'react' // Force HMR reload
import { MapPin, CalendarDays, Trophy } from 'lucide-react'
import { StatusBadge, MatchStatus } from '@/shared/components/ui/StatusBadge'

interface MatchCardProps {
  match: any
  isLive?: boolean
  variant?: 'standard' | 'compact' | 'hero' | 'horizontal'
}

export default function MatchCard({ match, isLive = false, variant = 'standard' }: MatchCardProps) {
  const dateObj = new Date(match.scheduled_time || match.start_time || Date.now())
  const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  const status: MatchStatus = isLive ? 'live' : (match.status || 'scheduled') as MatchStatus

  // Team Logo with Fallback
  const TeamLogo = ({ src, name, sizeClass }: { src: string, name: string, sizeClass: string }) => {
    const [imgError, setImgError] = useState(false)
    
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-b from-bg-elevated to-bg-surface flex items-center justify-center font-black text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.4)] ring-1 ring-border-strong overflow-hidden relative shrink-0`}>
        {!imgError && src ? (
          <img 
            src={src} 
            alt={name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        ) : (
          <span className="opacity-90 tracking-tighter drop-shadow-sm">{name?.substring(0, 2).toUpperCase() || 'TBD'}</span>
        )}
      </div>
    )
  }

  // STANDARD VARIANT
  if (variant === 'standard' || variant === 'compact') {
    const isCompact = variant === 'compact'
    return (
      <div className={`bg-bg-surface border border-border-dim rounded-[var(--radius-xl)] ${isCompact ? 'p-4' : 'p-6'} transition-normal hover:-translate-y-1 hover:shadow-md hover:border-border-strong relative overflow-hidden h-full flex flex-col group`}>
        
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5 truncate pr-2">
            <Trophy size={isCompact ? 12 : 14} className="text-text-muted shrink-0" />
            <span className="truncate">{match.tournament_name || 'Match'}</span>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Teams Matchup */}
        <div className="flex justify-between items-center relative z-10 mb-4 flex-1">
          <div className="flex flex-col items-center gap-2 w-2/5">
            <TeamLogo src={match.team1_logo} name={match.team1_short_name || match.team1_name} sizeClass={isCompact ? 'w-10 h-10' : 'w-12 h-12 md:w-16 md:h-16'} />
            <span className="text-xs md:text-sm font-bold text-text-primary text-center truncate w-full">{match.team1_short_name || match.team1_name || 'Team 1'}</span>
          </div>

          <div className="flex flex-col items-center justify-center w-1/5 shrink-0">
            {status === 'live' || status === 'completed' ? (
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg md:text-2xl font-black text-text-primary tracking-tighter">
                  {match.total_runs || 0}
                  <span className="text-xs md:text-sm font-bold text-text-muted">/{match.total_wickets || 0}</span>
                </span>
                <span className="text-[10px] md:text-xs font-medium text-text-secondary">({match.overs_bowled || '0.0'})</span>
              </div>
            ) : (
              <span className="text-xs md:text-sm font-black text-text-muted/50 italic uppercase">VS</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-2/5">
            <TeamLogo src={match.team2_logo} name={match.team2_short_name || match.team2_name} sizeClass={isCompact ? 'w-10 h-10' : 'w-12 h-12 md:w-16 md:h-16'} />
            <span className="text-xs md:text-sm font-bold text-text-primary text-center truncate w-full">{match.team2_short_name || match.team2_name || 'Team 2'}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className={`mt-auto pt-3 border-t border-border-dim flex justify-between items-center text-[10px] md:text-[11px] font-medium text-text-muted transition-colors group-hover:text-text-secondary`}>
          <div className="flex items-center gap-1.5 truncate pr-2"><MapPin size={12} className="shrink-0"/> <span className="truncate">{match.ground_name || 'TBD'}</span></div>
          {status !== 'live' && <div className="flex items-center gap-1.5 shrink-0"><CalendarDays size={12}/> {timeStr}</div>}
          {status === 'live' && <div className="text-brand-primary font-bold shrink-0">{match.match_stage || 'League'}</div>}
        </div>
      </div>
    )
  }

  // HERO VARIANT (Premium Look)
  if (variant === 'hero') {
    return (
      <div className={`group relative bg-gradient-to-br from-green-700 to-green-900 dark:from-slate-900 dark:to-slate-950 border ${status === 'live' ? 'border-status-danger/30' : 'border-white/5'} rounded-2xl p-6 md:p-10 transition-all duration-500 hover:shadow-2xl dark:shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden flex flex-col`}>
        {/* Subtle glowing background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 dark:from-blue-900/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full relative z-10 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            <span className="text-[10px] md:text-xs font-black text-white/80 uppercase tracking-[0.2em]">
              {match.tournament_name || 'Tournament'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/70">
            <CalendarDays size={12} className="text-brand-primary" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider">{dateStr}</span>
          </div>
        </div>

        {/* Matchup Area */}
        <div className="flex w-full justify-between items-center relative z-10">
          
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-4 w-1/3">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/20 dark:bg-[#0f172a] border-2 border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-white/10 transition-colors">
              {match.team1_logo ? (
                 <img src={match.team1_logo} alt={match.team1_short_name} className="w-full h-full object-cover" />
              ) : (
                 <span className="text-2xl md:text-4xl font-black text-white">{match.team1_short_name?.substring(0, 3) || 'T1'}</span>
              )}
            </div>
            <span className="text-lg md:text-2xl font-black text-white text-center tracking-tight drop-shadow-md">
              {match.team1_name || 'Team 1'}
            </span>
          </div>

          {/* Center VS / Score */}
          <div className="flex flex-col items-center justify-center w-1/3 shrink-0">
            {status === 'live' || status === 'completed' ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-lg">
                    {match.total_runs || 0}
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-white/60 ml-1">/{match.total_wickets || 0}</span>
                </div>
                <span className="text-xs md:text-sm font-bold text-brand-secondary bg-brand-primary/20 border border-brand-primary/30 px-3 py-1 rounded-full mt-1 tracking-widest uppercase">
                  Overs {match.overs_bowled || '0.0'}
                </span>
              </div>
            ) : (
              <span className="text-3xl md:text-4xl font-black text-cyan-400 italic uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                VS
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-4 w-1/3">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/20 dark:bg-[#0f172a] border-2 border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-white/10 transition-colors">
              {match.team2_logo ? (
                 <img src={match.team2_logo} alt={match.team2_short_name} className="w-full h-full object-cover" />
              ) : (
                 <span className="text-2xl md:text-4xl font-black text-white">{match.team2_short_name?.substring(0, 3) || 'T2'}</span>
              )}
            </div>
            <span className="text-lg md:text-2xl font-black text-white text-center tracking-tight drop-shadow-md">
              {match.team2_name || 'Team 2'}
            </span>
          </div>

        </div>
      </div>
    )
  }

  // HORIZONTAL VARIANT (Used for lists/recent results)
  if (variant === 'horizontal') {
    return (
      <div className={`bg-bg-surface border border-border-dim rounded-[var(--radius-xl)] p-4 transition-normal hover:-translate-y-0.5 hover:shadow-md hover:border-border-strong relative overflow-hidden h-full flex items-center justify-between group`}>
        
        {/* Left Side: Teams & Scores */}
        <div className="flex flex-col gap-3 w-2/3 pr-4 border-r border-border-dim">
          
          {/* Team 1 Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TeamLogo src={match.team1_logo} name={match.team1_short_name || match.team1_name} sizeClass="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-xs md:text-sm font-bold text-text-primary truncate">{match.team1_short_name || match.team1_name || 'Team 1'}</span>
            </div>
            {match.status !== 'scheduled' && (
              <span className={`text-sm md:text-base font-black ${match.match_winner_id === match.team1_id ? 'text-text-primary' : 'text-text-secondary'}`}>
                {match.total_runs || 0}<span className="text-[10px] font-bold text-text-muted">/{match.total_wickets || 0}</span>
              </span>
            )}
          </div>

          {/* Team 2 Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TeamLogo src={match.team2_logo} name={match.team2_short_name || match.team2_name} sizeClass="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-xs md:text-sm font-bold text-text-primary truncate">{match.team2_short_name || match.team2_name || 'Team 2'}</span>
            </div>
            {match.status !== 'scheduled' && (
              <span className={`text-sm md:text-base font-black ${match.match_winner_id === match.team2_id ? 'text-text-primary' : 'text-text-secondary'}`}>
                {match.team2_runs || 0}<span className="text-[10px] font-bold text-text-muted">/{match.team2_wickets || 0}</span>
              </span>
            )}
          </div>
          
        </div>

        {/* Right Side: Status & Metadata */}
        <div className="flex flex-col items-end justify-center w-1/3 pl-4 gap-2">
          <StatusBadge status={status} />
          <div className="text-[10px] md:text-xs text-text-muted text-right font-medium">
            {status === 'completed' ? (
              <span className="text-text-secondary font-bold">{dateStr}</span>
            ) : (
              <span>{dateStr}</span>
            )}
          </div>
        </div>

      </div>
    )
  }

  return null
}
