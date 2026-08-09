import React, { useMemo } from 'react'
import { OptimizedImage } from '@/features/fanzone/components/OptimizedImage'

type FullScorecardProps = {
  playingXi: any[]
  ballEvents: any[]
  inningsId: string
  battingTeamId: string
  bowlingTeamId: string
  playersMap: Record<string, string>
}

export function FullScorecard({ playingXi, ballEvents, inningsId, battingTeamId, bowlingTeamId, playersMap }: FullScorecardProps) {
  
  // Memoize the scorecard calculation so it only runs when ballEvents changes
  const { batters, bowlers, fow, extras } = useMemo(() => {
    
    // 1. Initialize stats structures
    const batterStats: Record<string, any> = {}
    const bowlerStats: Record<string, any> = {}
    const fowList: any[] = []
    const extrasTally = { wide: 0, no_ball: 0, bye: 0, leg_bye: 0, penalty: 0, total: 0 }
    
    // Setup playing XI
    playingXi.forEach(p => {
      if (p.team_id === battingTeamId) {
        batterStats[p.player.id] = { id: p.player.id, name: p.player.full_name, avatar_url: p.player.avatar_url, runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissal: '' }
      }
      if (p.team_id === bowlingTeamId) {
        bowlerStats[p.player.id] = { id: p.player.id, name: p.player.full_name, avatar_url: p.player.avatar_url, totalBalls: 0, maidens: 0, runs: 0, wickets: 0, dots: 0 }
      }
    })

    // 2. Reduce ball events
    let teamRuns = 0
    let teamWickets = 0

    // Ensure events are sorted ascending by delivery_sequence
    const sortedBalls = [...ballEvents].sort((a, b) => (a.delivery_sequence || 0) - (b.delivery_sequence || 0))

    sortedBalls.forEach(b => {
      teamRuns += (b.runs_off_bat + b.extras_runs)
      
      // Extras
      if (b.extras_runs > 0) {
        extrasTally.total += b.extras_runs
        if (b.extras_type) extrasTally[b.extras_type as keyof typeof extrasTally] += b.extras_runs
      }

      // Batter stats
      if (!batterStats[b.striker_id]) {
         // Fallback if player not in playingXI somehow
         const fallbackPlayer = playingXi.find(p => p.player.id === b.striker_id)?.player
         batterStats[b.striker_id] = { id: b.striker_id, name: playersMap[b.striker_id] || 'Unknown Batter', avatar_url: fallbackPlayer?.avatar_url, runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissal: '' }
      }
      batterStats[b.striker_id].runs += b.runs_off_bat
      if (b.extras_type !== 'wide') batterStats[b.striker_id].balls += 1
      if (b.runs_off_bat === 4) batterStats[b.striker_id].fours += 1
      if (b.runs_off_bat === 6) batterStats[b.striker_id].sixes += 1

      // Bowler stats
      if (!bowlerStats[b.bowler_id]) {
         const fallbackPlayer = playingXi.find(p => p.player.id === b.bowler_id)?.player
         bowlerStats[b.bowler_id] = { id: b.bowler_id, name: playersMap[b.bowler_id] || 'Unknown Bowler', avatar_url: fallbackPlayer?.avatar_url, totalBalls: 0, maidens: 0, runs: 0, wickets: 0, dots: 0 }
      }
      bowlerStats[b.bowler_id].runs += (b.runs_off_bat + b.extras_runs)
      if (b.is_legal_delivery) bowlerStats[b.bowler_id].totalBalls += 1
      if (b.runs_off_bat === 0 && b.extras_runs === 0 && !b.is_wicket) bowlerStats[b.bowler_id].dots += 1
      if (b.is_wicket && !['run_out', 'obstructing_field', 'retired_hurt'].includes(b.wicket_type || '')) {
         bowlerStats[b.bowler_id].wickets += 1
      }

      // Wickets & FOW
      if (b.is_wicket) {
        const dismissedId = b.dismissed_player_id || b.striker_id
        
        // Prevent duplicate FOW entries for the same player (e.g. from Undo bugs)
        if (batterStats[dismissedId] && !batterStats[dismissedId].out) {
            teamWickets += 1
            batterStats[dismissedId].out = true
            batterStats[dismissedId].dismissal = b.wicket_type || 'out'
            
            fowList.push({
               wicketNumber: teamWickets,
               runs: teamRuns,
               player: batterStats[dismissedId]?.name || 'Unknown'
            })
        }
      }
    })

    // Filter and sort batters: Those who played, or are in top 11
    const activeBatters = Object.values(batterStats).filter(b => b.balls > 0 || b.out).sort((a, b) => b.runs - a.runs) // Ideally sort by batting order
    const activeBowlers = Object.values(bowlerStats).filter(b => b.totalBalls > 0 || b.runs > 0)

    // Calculate Bowler Overs
    activeBowlers.forEach(b => {
       const overs = Math.floor(b.totalBalls / 6)
       const balls = b.totalBalls % 6
       b.oversDisplay = `${overs}.${balls}`
       b.eco = b.totalBalls > 0 ? ((b.runs / b.totalBalls) * 6).toFixed(2) : '0.00'
    })

    return { batters: activeBatters, bowlers: activeBowlers, fow: fowList, extras: extrasTally }
  }, [ballEvents, playingXi, battingTeamId, bowlingTeamId, playersMap])

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-8 pb-12">
      
      {/* Batting Table */}
      <div className="bg-gradient-to-b from-[#0f172a]/90 to-[#0A0D15] border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="bg-white/[0.03] px-6 py-4 font-black text-sm uppercase tracking-[0.2em] text-white border-b border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          Batting
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 whitespace-nowrap">
            <thead className="bg-black/20 text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Batter</th>
                <th className="px-4 sm:px-6 py-3 text-right">R</th>
                <th className="px-4 sm:px-6 py-3 text-right">B</th>
                <th className="px-4 sm:px-6 py-3 text-right">4s</th>
                <th className="px-4 sm:px-6 py-3 text-right">6s</th>
                <th className="px-4 sm:px-6 py-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="">
              {batters.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">No batting data yet.</td></tr>
              ) : (
                batters.map((b: any) => (
                  <tr key={b.id} className="hover:bg-white/[0.04] transition-colors group premium-glow-row">
                    <td className="px-6 py-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden relative border border-white/5">
                          <OptimizedImage
                            src={b.avatar_url}
                            alt={b.name}
                            fallbackInitials={b.name.charAt(0)}
                            fill
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-wide truncate max-w-[100px] sm:max-w-[200px] group-hover:text-blue-400 transition-colors">{b.name}</div>
                          <div className="text-[10px] capitalize truncate max-w-[100px] sm:max-w-[200px] font-medium mt-0.5">
                            {b.out ? <span className="text-red-400/90 font-bold">{b.dismissal.replace('_', ' ')}</span> : <span className="text-emerald-400 font-bold">Not Out</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right font-black text-white text-base relative z-10">{b.runs}</td>
                    <td className="px-4 sm:px-6 py-3 text-right text-slate-400 font-medium relative z-10">{b.balls}</td>
                    <td className="px-4 sm:px-6 py-3 text-right text-slate-400 font-medium relative z-10">{b.fours}</td>
                    <td className="px-4 sm:px-6 py-3 text-right text-slate-400 font-medium relative z-10">{b.sixes}</td>
                    <td className="px-4 sm:px-6 py-3 text-right text-slate-400 font-medium relative z-10">
                      {b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'}
                    </td>
                  </tr>
                ))
              )}
              {/* Extras Row */}
              {extras.total > 0 && (
                 <tr className="bg-white/[0.02] font-bold premium-glow-row">
                    <td className="px-6 py-4 text-slate-300">Extras</td>
                    <td colSpan={5} className="px-4 sm:px-6 py-4 text-right">
                       <span className="text-white text-base mr-2">{extras.total}</span> 
                       <span className="text-[10px] sm:text-xs text-slate-500 font-medium">(W {extras.wide}, NB {extras.no_ball}, B {extras.bye}, LB {extras.leg_bye})</span>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {fow.length > 0 && (
        <div className="bg-gradient-to-br from-[#0A0D15] to-[#0f172a] border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          {/* Scroll Indicator Fade with Arrow */}
          <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none z-10 flex items-center justify-end pr-2 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
            <span className="text-white/40 font-black text-2xl animate-pulse">›</span>
          </div>
          
          <div className="font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 mb-5 pl-2 relative z-20">
            Fall of Wickets
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar pl-2 pr-12 relative z-20">
            {fow.map((w: any, idx: number) => (
              <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3 min-w-[100px] transition-all hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(239,68,68,0.2)]">
                <div className="text-[10px] text-red-400/80 font-black mb-1 uppercase tracking-widest">Wkt {w.wicketNumber}</div>
                <div className="text-xl font-black text-white">{w.runs}</div>
                <div className="text-[11px] font-semibold text-slate-400 truncate w-full text-center mt-1" title={w.player}>{w.player}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bowling Table */}
      <div className="bg-gradient-to-b from-[#0f172a]/90 to-[#0A0D15] border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>
        <div className="bg-white/[0.03] px-6 py-4 font-black text-sm uppercase tracking-[0.2em] text-white border-b border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.8)]"></div>
          Bowling
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 whitespace-nowrap">
            <thead className="bg-black/20 text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Bowler</th>
                <th className="px-4 sm:px-6 py-3 text-right">O</th>
                <th className="px-4 sm:px-6 py-3 text-right">M</th>
                <th className="px-4 sm:px-6 py-3 text-right">R</th>
                <th className="px-4 sm:px-6 py-3 text-right">W</th>
                <th className="px-4 sm:px-6 py-3 text-right">ECON</th>
              </tr>
            </thead>
            <tbody className="">
              {bowlers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">No bowling data yet.</td></tr>
              ) : (
                bowlers.map((b: any) => (
                  <tr key={b.id} className="hover:bg-white/[0.04] transition-colors group premium-glow-row">
                    <td className="px-6 py-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden relative border border-white/5">
                          <OptimizedImage
                            src={b.avatar_url}
                            alt={b.name}
                            fallbackInitials={b.name.charAt(0)}
                            fill
                            className="rounded-full"
                          />
                        </div>
                        <div className="font-bold text-white tracking-wide truncate max-w-[100px] sm:max-w-[200px] group-hover:text-brand-primary transition-colors">{b.name}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right font-medium text-slate-300 relative z-10">{b.oversDisplay}</td>
                    <td className="px-4 sm:px-6 py-3 text-right text-slate-400 font-medium relative z-10">{b.maidens}</td>
                    <td className="px-4 sm:px-6 py-3 text-right font-black text-white text-base relative z-10">{b.runs}</td>
                    <td className="px-4 sm:px-6 py-3 text-right font-black text-brand-primary text-base drop-shadow-[0_0_5px_rgba(var(--brand-primary-rgb),0.5)] relative z-10">{b.wickets}</td>
                    <td className="px-4 sm:px-6 py-3 text-right text-slate-400 font-medium relative z-10">{b.eco}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
