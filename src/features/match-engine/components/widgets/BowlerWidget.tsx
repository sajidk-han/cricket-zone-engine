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
        
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_var(--brand-primary)]" />
            <span className="font-bold text-text-primary text-base sm:text-lg truncate max-w-[120px] sm:max-w-none">{bowler.name}</span>
          </div>
          
          <div className="flex sm:hidden items-center gap-3 text-[10px] text-text-secondary border-l border-white/10 pl-3">
            <div className="flex flex-col text-right">
              <span>Econ: <strong className="text-text-primary">{econ}</strong></span>
              <span>Dots: <strong className="text-text-primary">{dotPercent}%</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0 bg-bg-base sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
          <StatBox label="O" value={bowler.overs.toString()} />
          <StatBox label="M" value={bowler.maidens.toString()} />
          <StatBox label="R" value={bowler.runs.toString()} />
          <StatBox label="W" value={bowler.wickets.toString()} highlight />
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-text-secondary border-l border-white/10 pl-4">
          <div className="flex flex-col">
            <span>Econ: <strong className="text-text-primary">{econ}</strong></span>
            <span>Dots: <strong className="text-text-primary">{dotPercent}%</strong></span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
})

function StatBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col sm:items-center">
      <span className="text-[10px] text-text-secondary font-bold">{label}</span>
      <span className={`text-sm sm:text-xl font-black ${highlight ? 'text-brand-primary' : 'text-text-primary'}`}>{value}</span>
    </div>
  )
}
