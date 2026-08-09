import React, { useRef, useEffect } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { History } from 'lucide-react'
import { CommentaryEngine } from '@/lib/commentary-engine'

export const LiveMatchTimelineWidget = React.memo(function LiveMatchTimelineWidget({ balls, battingXi, bowlingXi }: { balls: any[], battingXi: any[], bowlingXi: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [balls]);

  return (
    <Card className="bg-bg-surface border-bg-elevated h-[400px] flex flex-col">
      <div className="bg-bg-elevated/50 px-4 py-3 border-b border-white/5 flex items-center justify-between">
         <span className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <History size={14} className="text-blue-400" /> Match Timeline
         </span>
      </div>
      <CardContent className="p-0 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col" ref={scrollRef}>
          {balls.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              Timeline is empty. Waiting for the first ball...
            </div>
          ) : (
            balls.map((ball, idx) => (
              <TimelineEvent key={ball.id || idx} ball={ball} battingXi={battingXi} bowlingXi={bowlingXi} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
})

function TimelineEvent({ ball, battingXi, bowlingXi }: { ball: any, battingXi: any[], bowlingXi: any[] }) {
  const overStr = `${ball.over_number}.${ball.ball_number}`;
  const isBoundary = ball.is_boundary;
  const isWicket = ball.is_wicket;
  
  const payload = {
    runsOffBat: ball.runs_off_bat,
    extrasRuns: ball.extras_runs,
    isLegalDelivery: ball.is_legal_delivery,
    isBoundary: ball.is_boundary,
    extrasType: ball.extras_type,
    isWicket: ball.is_wicket,
    wicketType: ball.wicket_type,
    dismissedPlayerId: null,
    incomingBatterId: null
  }
  
  const strikerName = battingXi?.find(p => p.player.id === ball.striker_id)?.player.full_name || 'Batter';
  const bowlerName = bowlingXi?.find(p => p.player.id === ball.bowler_id)?.player.full_name || 'Bowler';
  
  // Use CommentaryEngine instead of database field
  const commentaryText = CommentaryEngine.generateBallCommentary(ball.over_number, ball.ball_number, payload, strikerName, bowlerName);

  const runTotal = ball.runs_off_bat + ball.extras_runs;
  
  let circleColor = 'bg-bg-elevated text-text-secondary';
  if (isWicket) circleColor = 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  else if (isBoundary && runTotal === 6) circleColor = 'bg-brand-primary text-white shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)]';
  else if (isBoundary && runTotal === 4) circleColor = 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]';
  else if (runTotal === 0) circleColor = 'bg-bg-elevated/50 text-text-muted';
  else circleColor = 'bg-bg-elevated text-text-primary';

  let displayLabel = isWicket ? 'W' : (ball.extras_type ? ball.extras_type.charAt(0).toUpperCase() : runTotal.toString());

  return (
    <div className={`p-4 sm:p-5 border-b border-border-dim/50 flex items-start gap-4 sm:gap-6 transition-all hover:bg-bg-base/30 relative
      ${isWicket ? 'bg-red-500/[0.03]' : isBoundary ? 'bg-brand-primary/[0.03]' : ''}`}>
      
      {/* Over number */}
      <div className="w-8 sm:w-12 shrink-0 font-mono text-xs sm:text-sm font-bold text-text-muted mt-1 text-right">
        {overStr}
      </div>
      
      {/* Ball Circle */}
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border border-white/5 ${circleColor}`}>
        {displayLabel}
      </div>
      
      {/* Commentary */}
      <div className="flex flex-col flex-1 pt-0.5">
        <span className="text-sm text-text-primary leading-relaxed">
          <strong className="text-white drop-shadow-sm font-bold tracking-wide mr-1">{strikerName} to {bowlerName},</strong> 
          <span className="text-text-secondary/90">{commentaryText}</span>
        </span>
        {(isWicket || isBoundary) && (
          <span className={`text-[9px] sm:text-[10px] font-black tracking-widest uppercase mt-2 w-max px-2.5 py-1 rounded-sm
            ${isWicket ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}`}>
            {isWicket ? 'WICKET' : (runTotal === 6 ? 'SIX' : 'FOUR')}
          </span>
        )}
      </div>
    </div>
  )
}
