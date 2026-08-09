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
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] rounded-b-xl border border-t-0 border-brand-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden font-sans text-white relative">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Top Row: Score & Primary Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-black/40 px-5 py-3 premium-glow-row border-none relative z-10 backdrop-blur-sm">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <div className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            {batTeamName} {totalRuns}<span className="text-2xl sm:text-3xl text-yellow-500/80">/{matchData.total_wickets || 0}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white/90 tracking-wide">
            {oversBowled} <span className="text-sm text-white/50 font-bold">OV</span>
          </div>
        </div>
        
        <div className="flex items-center gap-5 mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-slate-300">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-slate-500 uppercase tracking-widest text-[10px] sm:text-xs">CRR</span> 
            <span className="text-white bg-white/10 px-2 py-0.5 rounded font-black">{crr}</span>
          </div>
          {targetInfo && (
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span className="text-brand-primary uppercase tracking-widest text-[10px] sm:text-xs">Target</span> 
              <span className="text-white bg-brand-primary/20 border border-brand-primary/30 px-2 py-0.5 rounded font-black shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.2)]">{targetInfo.runs}</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Active Players */}
      <div className="flex flex-col md:flex-row justify-between items-stretch relative z-10 premium-glow-row border-none">
        
        {/* Batters */}
        <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.02]">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-sm animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">▶</span>
                <span className="font-bold text-lg sm:text-xl text-white truncate max-w-[120px] sm:max-w-[200px] tracking-wide">{strikerName}</span>
              </div>
              <div className="font-black text-2xl text-white">
                {strikerStats.runs} <span className="text-sm font-bold text-slate-400 ml-1">({strikerStats.balls})</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-3.5"></span>
                <span className="font-semibold text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">{nonStrikerName}</span>
              </div>
              <div className="font-bold text-slate-300">
                {nonStrikerStats.runs} <span className="text-xs font-semibold text-slate-500 ml-1">({nonStrikerStats.balls})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bowler & Equation */}
        <div className="flex-1 px-5 py-4 flex flex-col justify-between bg-white/[0.01]">
          <div className="flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-[10px] text-brand-primary font-black uppercase tracking-widest mb-1 drop-shadow-sm">Current Bowler</span>
               <span className="font-bold text-lg sm:text-xl text-white truncate max-w-[150px] sm:max-w-[200px] tracking-wide">{bowlerName}</span>
             </div>
             <div className="font-black text-xl text-white tracking-wider flex gap-1.5 items-center">
               <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">O-M-R-W</span>
               {bowlerStats.overs}-{bowlerStats.maidens || 0}-{bowlerStats.runs}-<span className="text-brand-primary">{bowlerStats.wickets}</span>
             </div>
          </div>

          {targetInfo && (
            <div className="mt-3 text-sm font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-md px-3 py-1.5 text-center shadow-inner">
               Need {targetInfo.runs - totalRuns} runs from {((matchData.scheduled_overs * 6) - (completedOvers * 6 + ballsInOver))} balls
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Balls */}
      <div className="bg-black/60 px-5 py-2.5 pb-3 flex items-center gap-3 overflow-x-auto whitespace-nowrap custom-scrollbar pr-12 border-t border-white/5 relative z-10 backdrop-blur-md group">
        
        {/* Scroll Indicator Fade with Arrow */}
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-20 flex items-center justify-end pr-2 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
          <span className="text-white/40 font-black text-xl animate-pulse">›</span>
        </div>
        
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 bg-white/5 px-2 py-1 rounded relative z-10">Recent</span>
        {recentBalls.length === 0 ? (
           <span className="text-slate-500 text-xs italic font-medium relative z-10">No balls yet in this innings</span>
        ) : (
           recentBalls.map((b, i) => (
             <div key={b.id} className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-lg border relative z-10
                ${b.is_wicket ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 
                  b.extras_runs > 0 ? 'bg-slate-800 text-yellow-400 border-yellow-500/50' : 
                  b.runs_off_bat === 4 ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 
                  b.runs_off_bat === 6 ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_12px_rgba(var(--brand-primary-rgb),0.5)]' : 
                  'bg-slate-800/80 text-slate-300 border-slate-600/50'}
             `}>
               {b.is_wicket ? 'W' : (b.extras_runs > 0 ? `${b.extras_runs}${b.extras_type?.[0].toUpperCase()}` : b.runs_off_bat)}
             </div>
           ))
        )}
      </div>

    </div>
  )
}
