'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlayCircle, ShieldAlert, Target, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'

interface HeroMatchBannerProps {
  match: any // We will strictly type this later based on API response
  orgSlug: string
}

export function HeroMatchBanner({ match, orgSlug }: HeroMatchBannerProps) {
  // In a real implementation, we would hook up Supabase Realtime here 
  // to listen for updates to `match_statistics` and `matches` table.
  
  if (!match) {
    return (
      <Card className="w-full bg-bg-surface border-bg-elevated overflow-hidden min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Featured Matches</h3>
          <p className="text-text-secondary text-sm">There are no live or upcoming matches at the moment.</p>
        </div>
      </Card>
    )
  }

  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'
  const isUpcoming = match.status === 'scheduled'

  const team1 = match.team1 || { name: 'TBA', short_name: 'TBA' }
  const team2 = match.team2 || { name: 'TBA', short_name: 'TBA' }
  const stats = match.match_statistics || {}

  const team1Runs = stats.team1_runs || 0
  const team1Wickets = stats.team1_wickets || 0
  const team1Overs = stats.team1_overs || 0

  const team2Runs = stats.team2_runs || 0
  const team2Wickets = stats.team2_wickets || 0
  const team2Overs = stats.team2_overs || 0

  // Basic calculation for Run Rate
  const calcRR = (runs: number, overs: number) => overs > 0 ? (runs / overs).toFixed(2) : '0.00'

  return (
    <Card className="w-full bg-gradient-to-br from-bg-surface to-bg-base border-bg-elevated overflow-hidden relative shadow-2xl">
      {/* Dynamic Background Glow based on Live Status */}
      {isLive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      )}
      
      <CardContent className="p-0">
        <div className="p-6 md:p-10 relative z-10">
          
          {/* Header Context */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm font-semibold tracking-wider uppercase text-text-secondary">
              <span className="text-brand-accent">{match.tournament?.name || 'Tournament'}</span>
              <span>•</span>
              <span>{match.venue_name || 'TBA Venue'}</span>
            </div>
            
            <div className="flex items-center gap-3">
              {isLive && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live Now</span>
                </div>
              )}
              {isUpcoming && (
                <div className="bg-bg-elevated text-text-secondary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  Upcoming
                </div>
              )}
              {isCompleted && (
                <div className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  Completed
                </div>
              )}
            </div>
          </div>

          {/* Scores Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
            
            {/* Team 1 */}
            <div className="text-center md:text-left space-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-bg-elevated rounded-full mx-auto md:mx-0 flex items-center justify-center border-2 border-white/5 shadow-lg overflow-hidden">
                {team1.logo_url ? (
                  <img src={team1.logo_url} alt={team1.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-text-muted">{team1.short_name}</span>
                )}
              </div>
              <h2 className="text-xl md:text-3xl font-black text-white mt-4">{team1.name}</h2>
              {isLive || isCompleted ? (
                <div className="flex flex-col md:items-start items-center">
                  <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    {team1Runs}<span className="text-2xl md:text-3xl text-text-muted">/{team1Wickets}</span>
                  </div>
                  <div className="text-sm font-semibold text-text-secondary mt-1 tracking-widest">
                    ({team1Overs} Ov) • CRR: {calcRR(team1Runs, team1Overs)}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-text-muted mt-2">Yet to bat</div>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-bg-elevated border border-white/10 flex items-center justify-center font-black text-text-muted italic shadow-inner">
                VS
              </div>
            </div>

            {/* Team 2 */}
            <div className="text-center md:text-right space-y-2">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-bg-elevated rounded-full mx-auto md:ml-auto md:mr-0 flex items-center justify-center border-2 border-white/5 shadow-lg overflow-hidden">
                {team2.logo_url ? (
                  <img src={team2.logo_url} alt={team2.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-text-muted">{team2.short_name}</span>
                )}
              </div>
              <h2 className="text-xl md:text-3xl font-black text-white mt-4">{team2.name}</h2>
              {isLive || isCompleted ? (
                <div className="flex flex-col md:items-end items-center">
                  <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    {team2Runs}<span className="text-2xl md:text-3xl text-text-muted">/{team2Wickets}</span>
                  </div>
                  <div className="text-sm font-semibold text-text-secondary mt-1 tracking-widest">
                    ({team2Overs} Ov) • CRR: {calcRR(team2Runs, team2Overs)}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-text-muted mt-2">Yet to bat</div>
              )}
            </div>

          </div>

          {/* Context Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-white/10">
            <div className="flex-1 text-center md:text-left">
              {isLive && stats.target_score ? (
                <div className="text-lg font-bold text-brand-primary">
                  {team2.name} need {stats.target_score - team2Runs} runs from {(20 * 6) - (Math.floor(team2Overs) * 6 + (team2Overs % 1) * 10)} balls.
                </div>
              ) : match.toss_decision ? (
                <div className="text-sm font-medium text-text-secondary">
                  Toss won by <strong className="text-white">TBA</strong> and elected to <strong className="text-white">{match.toss_decision}</strong>.
                </div>
              ) : (
                <div className="text-sm font-medium text-text-secondary">Match information unavailable.</div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {isLive && (
                <Button className="flex-1 md:flex-none font-bold bg-brand-primary hover:bg-brand-accent text-white shadow-lg shadow-brand-primary/20 group">
                  <PlayCircle size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                  Watch Live
                </Button>
              )}
              <Link href={`/fanzone/${orgSlug}/matches/${match.slug || match.id}`} className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full font-bold border-bg-elevated hover:bg-bg-elevated hover:text-white transition-colors group">
                  Full Scorecard
                  <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
