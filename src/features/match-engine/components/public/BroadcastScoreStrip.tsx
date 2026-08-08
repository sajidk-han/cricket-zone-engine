import React from 'react'
import { MatchStatus } from '@/shared/components/ui/StatusBadge'

type BroadcastScoreStripProps = {
  matchData: any
  matchStats: any
  playersMap: Record<string, string>
  recentBalls: any[]
  targetInfo: { runs: number, rr: string } | null
}

export function BroadcastScoreStrip({ matchData, matchStats, playersMap, recentBalls, targetInfo }: BroadcastScoreStripProps) {
  
  if (!matchData) return null

  // Extract stats from canonical match_statistics JSON
  const strikerId = matchStats?.current_striker
  const nonStrikerId = matchStats?.current_non_striker
  const bowlerId = matchStats?.current_bowler

  const strikerStats = matchStats?.striker_stats || { runs: 0, balls: 0, fours: 0, sixes: 0 }
  const nonStrikerStats = matchStats?.non_striker_stats || { runs: 0, balls: 0, fours: 0, sixes: 0 }
  const bowlerStats = matchStats?.bowler_stats || { overs: 0, runs: 0, wickets: 0 }

  const strikerName = playersMap[strikerId] || 'Striker'
  const nonStrikerName = playersMap[nonStrikerId] || 'Non-Striker'
  const bowlerName = playersMap[bowlerId] || 'Bowler'

  // Calculate CRR
  const totalRuns = matchData.total_runs || 0
  const oversBowled = matchData.overs_bowled || 0
  
  // oversBowled is stored as 1.4 (meaning 1 over 4 balls). Convert to fractional overs for CRR
  const completedOvers = Math.floor(oversBowled)
  const ballsInOver = Math.round((oversBowled % 1) * 10)
  const fractionalOvers = completedOvers + (ballsInOver / 6)
  
  const crr = fractionalOvers > 0 ? (totalRuns / fractionalOvers).toFixed(2) : '0.00'

  // Batting Team
  const battingTeamName = matchData.current_innings === 1 
    ? (matchData.team1_id === matchData.toss_winner_id ? (matchData.toss_decision === 'bat' ? matchData.team1_short_name : matchData.team2_short_name) : (matchData.toss_decision === 'bat' ? matchData.team2_short_name : matchData.team1_short_name))
    : (matchData.team1_id === matchData.toss_winner_id ? (matchData.toss_decision === 'bowl' ? matchData.team1_short_name : matchData.team2_short_name) : (matchData.toss_decision === 'bowl' ? matchData.team2_short_name : matchData.team1_short_name))
    
  // Fallback if batting team logic is complex
  const batTeamName = matchData.batting_team_id === matchData.team1_id ? matchData.team1_short_name : matchData.team2_short_name

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-indigo-950 rounded-b-xl border border-t-0 border-indigo-500/30 shadow-2xl overflow-hidden font-sans text-white">
      
      {/* Top Row: Score & Primary Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-black/40 px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="text-2xl sm:text-3xl font-black tracking-wider text-yellow-400">
            {batTeamName} {totalRuns}/{matchData.total_wickets || 0}
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-300">
            {oversBowled} OV
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm font-semibold text-slate-400">
          <div>CRR: <span className="text-white">{crr}</span></div>
          {targetInfo && (
            <div className="bg-indigo-600/30 px-3 py-1 rounded border border-indigo-500/30">
              Target: <span className="text-white font-bold">{targetInfo.runs}</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Active Players */}
      <div className="flex flex-col md:flex-row justify-between items-stretch">
        
        {/* Batters */}
        <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg leading-none">▶</span>
                <span className="font-bold text-lg truncate max-w-[120px] sm:max-w-[180px]">{strikerName}</span>
              </div>
              <div className="font-black text-xl">
                {strikerStats.runs} <span className="text-sm font-medium text-slate-400">({strikerStats.balls})</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-4"></span>
                <span className="font-semibold truncate max-w-[120px] sm:max-w-[180px]">{nonStrikerName}</span>
              </div>
              <div className="font-bold">
                {nonStrikerStats.runs} <span className="text-xs font-medium text-slate-400">({nonStrikerStats.balls})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bowler & Equation */}
        <div className="flex-1 px-4 py-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bowler</span>
               <span className="font-bold text-base truncate max-w-[150px]">{bowlerName}</span>
             </div>
             <div className="font-black text-lg text-slate-200">
               {bowlerStats.overs}-{bowlerStats.maidens || 0}-{bowlerStats.runs}-{bowlerStats.wickets}
             </div>
          </div>

          {targetInfo && (
            <div className="mt-2 text-sm font-bold text-yellow-400">
               Need {targetInfo.runs - totalRuns} runs from {((matchData.scheduled_overs * 6) - (completedOvers * 6 + ballsInOver))} balls
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Balls */}
      <div className="bg-slate-900/80 px-4 py-1.5 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Recent</span>
        {recentBalls.length === 0 ? (
           <span className="text-slate-500 text-xs italic">No balls yet</span>
        ) : (
           recentBalls.map((b, i) => (
             <div key={b.id} className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-black
                ${b.is_wicket ? 'bg-red-500 text-white' : 
                  b.extras_runs > 0 ? 'bg-slate-700 text-yellow-400 border border-yellow-500/30' : 
                  b.runs_off_bat === 4 || b.runs_off_bat === 6 ? 'bg-blue-600 text-white' : 
                  'bg-slate-800 text-slate-300 border border-slate-700'}
             `}>
               {b.is_wicket ? 'W' : (b.extras_runs > 0 ? `${b.extras_runs}${b.extras_type?.[0].toUpperCase()}` : b.runs_off_bat)}
             </div>
           ))
        )}
      </div>

    </div>
  )
}
