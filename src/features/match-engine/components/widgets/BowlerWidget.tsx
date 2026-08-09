import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Target, RefreshCw } from 'lucide-react'

type BowlerStats = {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  dots: number;
  totalBalls: number;
}

export const BowlerWidget = React.memo(function BowlerWidget({ bowler, onChangeBowler, className }: { bowler: BowlerStats | null, onChangeBowler?: () => void, className?: string }) {
  if (!bowler) return null;

  const econ = bowler.overs > 0 ? (bowler.runs / bowler.overs).toFixed(1) : '0.0';
  const dotPercent = bowler.totalBalls > 0 ? Math.round((bowler.dots / bowler.totalBalls) * 100) : 0;

  return (
    <Card className={`bg-bg-surface border-bg-elevated flex flex-col overflow-hidden ${className || ''}`}>
      <div className="bg-bg-elevated/50 px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
         <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Target size={12} className="text-brand-primary" /> Current Bowler
         </span>
         {onChangeBowler && (
           <button 
             onClick={onChangeBowler}
             className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/20 hover:bg-brand-primary/40 border border-brand-primary/50 transition-colors px-3 py-1 rounded-full flex items-center gap-1.5"
           >
             <RefreshCw size={10} />
             Change
           </button>
         )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center justify-between w-full sm:w-auto relative">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_var(--brand-primary)]" />
            <span className="font-bold text-white text-base sm:text-lg truncate tracking-wide max-w-[120px] sm:max-w-none drop-shadow-sm">{bowler.name}</span>
          </div>
          
          <div className="flex sm:hidden items-center gap-3 text-[10px] text-text-muted border-l border-white/10 pl-3 font-medium">
            <div className="flex flex-col text-right">
              <span>Econ: <strong className="text-white/80">{econ}</strong></span>
              <span>Dots: <strong className="text-white/80">{dotPercent}%</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-8 w-full sm:w-auto mt-4 sm:mt-0">
          <StatBox label="O" value={bowler.overs.toString()} />
          <StatBox label="M" value={bowler.maidens.toString()} />
          <StatBox label="R" value={bowler.runs.toString()} />
          <StatBox label="W" value={bowler.wickets.toString()} highlight />
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs text-text-muted border-l border-white/10 pl-6 font-medium">
          <div className="flex flex-col gap-1">
            <span className="flex items-center justify-between w-20">Econ <strong className="text-white/80">{econ}</strong></span>
            <span className="flex items-center justify-between w-20">Dots <strong className="text-white/80">{dotPercent}%</strong></span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
})

function StatBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col sm:items-center min-w-[32px] sm:min-w-[40px]">
      <span className="text-[10px] text-text-secondary/70 font-bold uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-lg sm:text-2xl font-black ${highlight ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.5)]' : 'text-white'}`}>{value}</span>
    </div>
  )
}
