import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { getMatchSummary } from '@/app/actions/matches'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, MapPin, User, CloudSun, AlertCircle, Play } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import Link from 'next/link'
import { ProceedToTossButton } from './MatchActions'
import { MatchStatusWidget } from '@/features/match-engine/components/widgets/MatchStatusWidget'
import { CountdownTimer } from './CountdownTimer'
import { LiveStreamPlayer } from '@/features/match-engine/components/widgets/LiveStreamPlayer'
import { MatchStatus } from '@/shared/components/ui/StatusBadge'

export default async function MatchOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getMatchSummary(resolvedParams.id)
  
  if (!res.success || !res.data) notFound()
  const match = res.data

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Stream Player (Conditionally rendered) */}
          <LiveStreamPlayer 
            url={match.live_stream_url || null} 
            status={(match.status || 'scheduled') as MatchStatus} 
          />
          
          {/* Main Scorecard / Match Status Card */}
          <Card className="relative overflow-hidden border-0 shadow-2xl rounded-3xl bg-gradient-to-r from-[#2d0a3d] via-[#1a103c] to-[#0a1e4a]">
          
          {/* Subtle glow overlays */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
          
          <CardContent className="p-8 sm:p-12 relative z-10">
            <div className="flex justify-between items-center mb-12 text-sm font-black text-white/70 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_#10b981]"></div> {match.tournament.name}
              </span>
              <span className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5 shadow-inner backdrop-blur-md">
                <CalendarDays size={16} className="text-brand-primary"/> 
                {new Date(match.scheduled_time).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center relative">
              {/* Team 1 (Magenta/Pink Shield) */}
              <div className="flex flex-col items-center w-2/5 group">
                <div className="w-32 h-40 sm:w-40 sm:h-48 bg-gradient-to-b from-fuchsia-900/40 to-fuchsia-950/80 flex items-center justify-center font-black text-4xl text-white shadow-[0_0_40px_rgba(217,70,239,0.2)] border-2 border-fuchsia-500/40 relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_60px_rgba(217,70,239,0.5)] group-hover:border-fuchsia-400 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)' }}>
                  {/* Inner glowing shield */}
                  <div className="absolute inset-[6px] bg-gradient-to-br from-fuchsia-500/20 to-transparent border-[1.5px] border-fuchsia-400/50" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)' }}></div>
                  
                  {match.team1.logo_url ? <img src={match.team1.logo_url} className="w-20 h-20 object-contain relative z-20 drop-shadow-xl"/> : <span className="relative z-20 drop-shadow-md">{match.team1.short_name}</span>}
                </div>
                
                <div className="mt-6 flex flex-col items-center w-full max-w-[200px]">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_10px_rgba(217,70,239,0.8)] mb-3"></div>
                  <h2 className="text-lg sm:text-xl font-black text-white text-center tracking-widest drop-shadow-md uppercase">{match.team1.name}</h2>
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_10px_rgba(217,70,239,0.8)] mt-3"></div>
                </div>
              </div>

              {/* VS & Timer */}
              <div className="flex flex-col items-center gap-6 w-1/5 shrink-0 z-20 pt-8">
                {match.status === 'scheduled' && (
                  <div className="flex flex-col items-center">
                    <CountdownTimer targetDate={match.scheduled_time} />
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-fuchsia-800 to-blue-800 px-6 py-2 rounded-full border border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.4)] relative">
                  <div className="absolute inset-0 rounded-full border border-white/10 scale-90"></div>
                  <span className="text-xl sm:text-2xl font-black text-white italic drop-shadow-md relative z-10 tracking-widest">VS</span>
                </div>
              </div>

              {/* Team 2 (Blue Shield) */}
              <div className="flex flex-col items-center w-2/5 group">
                <div className="w-32 h-40 sm:w-40 sm:h-48 bg-gradient-to-b from-blue-900/40 to-blue-950/80 flex items-center justify-center font-black text-4xl text-white shadow-[0_0_40px_rgba(59,130,246,0.2)] border-2 border-blue-500/40 relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] group-hover:border-blue-400 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)' }}>
                  {/* Inner glowing shield */}
                  <div className="absolute inset-[6px] bg-gradient-to-bl from-blue-500/20 to-transparent border-[1.5px] border-blue-400/50" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)' }}></div>
                  
                  {match.team2.logo_url ? <img src={match.team2.logo_url} className="w-20 h-20 object-contain relative z-20 drop-shadow-xl"/> : <span className="relative z-20 drop-shadow-md">{match.team2.short_name}</span>}
                </div>
                
                <div className="mt-6 flex flex-col items-center w-full max-w-[200px]">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)] mb-3"></div>
                  <h2 className="text-lg sm:text-xl font-black text-white text-center tracking-widest drop-shadow-md uppercase">{match.team2.name}</h2>
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)] mt-3"></div>
                </div>
              </div>
            </div>
            
            {/* Call to Action based on Status */}
            <div className="mt-16 flex justify-center">
              {match.status === 'scheduled' && (
                <div className="shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-full transition-transform hover:scale-105">
                  <ProceedToTossButton matchId={match.id} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
        
        {/* Match Info Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-bg-surface border-bg-elevated h-full">
            <CardContent className="p-6">
              <h3 className="font-bold text-text-primary mb-4 uppercase tracking-widest text-xs">Match Details</h3>
              <div className="space-y-4">
                <InfoRow icon={<Clock size={16}/>} label="Time" value={new Date(match.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />
                <InfoRow icon={<MapPin size={16}/>} label="Ground" value={match.ground?.name || 'TBD'} />
                <InfoRow icon={<CloudSun size={16}/>} label="Weather" value="Clear • 28°C" />
                <InfoRow icon={<AlertCircle size={16}/>} label="Stage" value={match.match_stage} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operational Control Panel (Match Status Widget) */}
        <div className="lg:col-span-3">
           <MatchStatusWidget match={match} />
        </div>
        
      </div>

    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
      <div className="flex items-center gap-3 text-text-secondary">
        <span className="text-brand-primary">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-text-primary">{value}</span>
    </div>
  )
}


