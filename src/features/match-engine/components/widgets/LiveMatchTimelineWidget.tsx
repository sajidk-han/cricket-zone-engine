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

  return (
    <div className={`p-4 border-b border-white/5 flex items-start gap-4 transition-colors hover:bg-white/[0.02]
      ${isWicket ? 'bg-red-500/5' : isBoundary ? 'bg-brand-primary/5' : ''}`}>
      
      <div className="w-12 shrink-0 font-mono text-sm font-bold text-text-secondary mt-1">
        {overStr}
      </div>
      
      <div className="flex flex-col flex-1">
        <span className="text-sm text-text-primary">
          <strong className="text-text-primary">{ball.runs_off_bat + ball.extras_runs} runs.</strong> 
          {' ' + commentaryText}
        </span>
        {(isWicket || isBoundary) && (
          <span className={`text-[10px] font-bold uppercase mt-1 w-max px-2 py-0.5 rounded-full
            ${isWicket ? 'bg-red-500/20 text-red-400' : 'bg-brand-primary/20 text-brand-primary'}`}>
            {isWicket ? 'WICKET' : 'BOUNDARY'}
          </span>
        )}
      </div>

    </div>
  )
}
