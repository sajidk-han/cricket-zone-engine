import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Trophy, TrendingUp, TrendingDown, Star, AlertTriangle } from 'lucide-react'
import { ShareButton } from '@/shared/components/ui/ShareButton'

export function EnterpriseScoreboardWidget({ matchState, match, lastEvent }: { matchState: any, match: any, lastEvent?: any }) {
  const [celebration, setCelebration] = useState<'SIX' | 'WICKET' | null>(null);

  useEffect(() => {
    if (!lastEvent) return;
    
    if (lastEvent.is_wicket) {
      setCelebration('WICKET');
    } else if (lastEvent.runs_off_bat === 6) {
      setCelebration('SIX');
    }
    
    if (lastEvent.is_wicket || lastEvent.runs_off_bat === 6) {
      const timer = setTimeout(() => setCelebration(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastEvent?.id]);

  if (!matchState) return null;

  const oversBowledNum = Math.floor(matchState.legalBallsBowled / 6) + '.' + (matchState.legalBallsBowled % 6);
  const crr = matchState.legalBallsBowled > 0 ? ((matchState.totalRuns / matchState.legalBallsBowled) * 6).toFixed(2) : '0.00';
  
  // Future enhancements: Target, RRR, Partnership, Last 6 Balls
  
  return (
    <Card className="bg-gradient-to-br from-[#1A1F2C] to-[#0A0D15] border-0 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
          
          {/* Main Score Area */}
          <div className="flex flex-col items-center sm:items-start relative">
            
            {/* Celebration Overlay */}
            {celebration === 'SIX' && (
              <div className="absolute -top-10 -right-10 bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full animate-bounce shadow-[0_0_20px_rgba(34,197,94,0.6)] z-20 flex items-center gap-1">
                <Star size={12} /> MASSIVE SIX!
              </div>
            )}
            {celebration === 'WICKET' && (
              <div className="absolute -top-10 -right-10 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)] z-20 flex items-center gap-1">
                <AlertTriangle size={12} /> WICKET!
              </div>
            )}

            <div className="w-full flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                <Trophy size={10} /> Live Score
              </span>
              <div className="sm:hidden">
                <ShareButton title={`Live Match: ${match?.name || 'Tournament'}`} text={`Score: ${matchState.totalRuns}/${matchState.totalWickets}`} />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 transition-transform duration-300">
              <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-md">
                {matchState.totalRuns}
              </h1>
              <span className="text-3xl font-bold text-white/60">
                /{matchState.totalWickets}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm font-bold text-text-secondary">
              <span>Overs: <strong className="text-white">{oversBowledNum}</strong></span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>CRR: <strong className="text-white">{crr}</strong></span>
            </div>
          </div>

          {/* Right Area - Mini Stats / Target */}
          {match.current_innings > 1 && (
            <div className="flex flex-col items-center sm:items-end bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm min-w-[200px]">
              <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2">Target Overview</span>
              <div className="flex flex-col items-end gap-1 w-full">
                <div className="flex justify-between w-full text-xs">
                   <span className="text-text-secondary">Target</span>
                   <strong className="text-white">TBD</strong>
                </div>
                <div className="flex justify-between w-full text-xs">
                   <span className="text-text-secondary">Required</span>
                   <strong className="text-white">TBD</strong>
                </div>
                <div className="flex justify-between w-full text-xs mt-2 pt-2 border-t border-white/10">
                   <span className="text-text-secondary">RRR</span>
                   <strong className="text-white">TBD</strong>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Share Button */}
          <div className="hidden sm:block absolute top-6 right-6 z-20">
            <ShareButton title={`Live Match: ${match?.name || 'Tournament'}`} text={`Score: ${matchState.totalRuns}/${matchState.totalWickets}`} />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
