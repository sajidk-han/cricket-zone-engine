import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Clock, Users, Shield, Target } from 'lucide-react'

export function MatchStatusWidget({ match }: { match: any }) {
  const currentInnings = match.current_innings || 1;
  const isMatchLocked = match.status === 'live'; // Or explicitly check lock owner
  
  return (
    <Card className="bg-bg-surface border-bg-elevated">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-text-primary uppercase tracking-widest text-xs flex items-center gap-2">
            <Clock size={14} className="text-brand-primary" /> Match Status Center
          </h3>
          <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase border
            ${match.status === 'live' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
            {match.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusItem label="Toss" value={match.toss_winner_id ? 'Completed' : 'Pending'} />
          <StatusItem label="Innings" value={`Innings ${currentInnings}`} />
          <StatusItem label="Match Lock" value={isMatchLocked ? 'Locked' : 'Open'} icon={<Shield size={12}/>} />
          {currentInnings > 1 && (
             <StatusItem label="Target" value="-" icon={<Target size={12}/>} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusItem({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-bg-elevated/50 p-3 rounded-lg border border-white/5">
      <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="text-sm font-bold text-text-primary">{value}</span>
    </div>
  )
}
