import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Activity, RefreshCw } from 'lucide-react'

type BatterStats = {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker: boolean;
}

export const BattersWidget = React.memo(function BattersWidget({ striker, nonStriker, onChangeBatter }: { striker: BatterStats | null, nonStriker: BatterStats | null, onChangeBatter?: () => void }) {
  return (
    <Card className="bg-bg-surface border-bg-elevated overflow-hidden">
      <div className="bg-bg-elevated/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
         <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Activity size={12} className="text-brand-primary" /> Batters
         </span>
         {onChangeBatter && (
           <button 
             onClick={onChangeBatter}
             className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/20 hover:bg-brand-primary/40 border border-brand-primary/50 transition-colors px-3 py-1 rounded-full flex items-center gap-1.5"
           >
             <RefreshCw size={10} />
             Change
           </button>
         )}
      </div>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {striker && <BatterRow batter={striker} />}
          {nonStriker && <BatterRow batter={nonStriker} />}
        </div>
      </CardContent>
    </Card>
  )
})

function BatterRow({ batter }: { batter: BatterStats }) {
  const sr = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0';
  return (
    <div className={`relative flex items-center justify-between p-4 sm:p-5 border-b border-border-dim last:border-0 transition-colors ${batter.isStriker ? 'bg-gradient-to-r from-brand-primary/10 to-transparent' : 'hover:bg-bg-elevated/30'}`}>
      {batter.isStriker && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r-full shadow-[0_0_10px_var(--brand-primary)]" />
      )}
      <div className="flex items-center gap-3 sm:gap-4 pl-1">
        {batter.isStriker ? (
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_var(--brand-primary)]" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-transparent" />
        )}
        <span className={`font-bold tracking-wide text-sm sm:text-base ${batter.isStriker ? 'text-white drop-shadow-sm' : 'text-text-secondary'}`}>{batter.name}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8 ml-auto">
        <div className="text-right flex items-baseline justify-end gap-1.5 w-16 sm:w-20">
          <span className={`text-xl sm:text-2xl font-black ${batter.isStriker ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.5)]' : 'text-white'}`}>{batter.runs}</span>
          <span className="text-xs sm:text-sm text-text-muted font-medium">({batter.balls})</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 text-[10px] sm:text-xs text-text-muted font-medium justify-end">
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 w-12 sm:w-16">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary/50 sm:hidden">SR</span>
            <span className="text-white/80"><span className="hidden sm:inline mr-1 text-text-secondary/50">SR</span>{sr}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 w-6 sm:w-10">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary/50 sm:hidden">4s</span>
            <span className="text-white/80"><span className="hidden sm:inline mr-1 text-text-secondary/50">4s</span>{batter.fours}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 w-6 sm:w-10">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary/50 sm:hidden">6s</span>
            <span className="text-white/80"><span className="hidden sm:inline mr-1 text-text-secondary/50">6s</span>{batter.sixes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
