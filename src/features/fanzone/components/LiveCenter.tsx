'use client'

import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Activity, Zap, ShieldAlert, Target } from 'lucide-react'

interface LiveCenterProps {
  match: any
}

export function LiveCenter({ match }: LiveCenterProps) {
  if (!match || match.status !== 'live') return null

  // In a real scenario, this data comes via Supabase Realtime from `match_events`, `ball_events`, etc.
  // We'll mock the structure to match the design blueprint.
  const currentOverStr = '18.4'
  const timeline = ['4', '1', 'W', '0', '6']
  
  const lastWicket = {
    player: 'Ahmed',
    howOut: 'c Ali b Khan',
    score: '145/3'
  }

  const partnership = '74 Runs (42 balls)'
  const required = '12 from 8'

  return (
    <Card className="w-full bg-bg-surface border-bg-elevated overflow-hidden">
      <div className="bg-bg-elevated/50 px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Activity size={16} className="text-brand-primary" />
        <h3 className="font-bold text-white text-sm tracking-wide uppercase">Live Center</h3>
      </div>
      
      <CardContent className="p-0 divide-y divide-white/5">
        
        {/* Current Over Timeline */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-text-secondary tracking-widest uppercase mb-2 flex items-center gap-2">
              Current Over <span className="text-white bg-bg-elevated px-2 py-0.5 rounded">{currentOverStr}</span>
            </div>
            <div className="flex gap-2 items-center">
              {timeline.map((ball, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-inner border
                    ${ball === 'W' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 
                      ball === '4' || ball === '6' ? 'bg-brand-primary text-white border-brand-accent' : 
                      'bg-bg-base text-white border-bg-elevated'}`}
                >
                  {ball}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-bg-elevated flex items-center justify-center text-text-muted animate-pulse">
                ?
              </div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-xs font-semibold text-text-secondary tracking-widest uppercase mb-1">Required</div>
             <div className="text-xl font-black text-brand-accent">{required}</div>
          </div>
        </div>

        {/* Partnership & Last Wicket */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          <div className="p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
               <Zap size={20} className="text-blue-500" />
             </div>
             <div>
               <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-1">Current Partnership</div>
               <div className="text-lg font-bold text-white">{partnership}</div>
               <div className="text-xs text-text-muted mt-1">Azam (41) • Rizwan (33)</div>
             </div>
          </div>
          
          <div className="p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
             <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
               <ShieldAlert size={20} className="text-red-500" />
             </div>
             <div>
               <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-1">Last Wicket</div>
               <div className="text-lg font-bold text-white">{lastWicket.player} <span className="text-sm font-medium text-text-muted">({lastWicket.score})</span></div>
               <div className="text-xs text-text-muted mt-1">{lastWicket.howOut}</div>
             </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
