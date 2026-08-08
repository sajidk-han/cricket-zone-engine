import React, { useMemo } from 'react'

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
        batterStats[p.player.id] = { id: p.player.id, name: p.player.full_name, runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissal: '' }
      }
      if (p.team_id === bowlingTeamId) {
        bowlerStats[p.player.id] = { id: p.player.id, name: p.player.full_name, totalBalls: 0, maidens: 0, runs: 0, wickets: 0, dots: 0 }
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
         batterStats[b.striker_id] = { id: b.striker_id, name: playersMap[b.striker_id] || 'Unknown Batter', runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissal: '' }
      }
      batterStats[b.striker_id].runs += b.runs_off_bat
      if (b.extras_type !== 'wide') batterStats[b.striker_id].balls += 1
      if (b.runs_off_bat === 4) batterStats[b.striker_id].fours += 1
      if (b.runs_off_bat === 6) batterStats[b.striker_id].sixes += 1

      // Bowler stats
      if (!bowlerStats[b.bowler_id]) {
         bowlerStats[b.bowler_id] = { id: b.bowler_id, name: playersMap[b.bowler_id] || 'Unknown Bowler', totalBalls: 0, maidens: 0, runs: 0, wickets: 0, dots: 0 }
      }
      bowlerStats[b.bowler_id].runs += (b.runs_off_bat + b.extras_runs)
      if (b.is_legal_delivery) bowlerStats[b.bowler_id].totalBalls += 1
      if (b.runs_off_bat === 0 && b.extras_runs === 0 && !b.is_wicket) bowlerStats[b.bowler_id].dots += 1
      if (b.is_wicket && !['run_out', 'obstructing_field', 'retired_hurt'].includes(b.wicket_type || '')) {
         bowlerStats[b.bowler_id].wickets += 1
      }

      // Wickets & FOW
      if (b.is_wicket) {
        teamWickets += 1
        const dismissedId = b.dismissed_player_id || b.striker_id
        if (batterStats[dismissedId]) {
          batterStats[dismissedId].out = true
          batterStats[dismissedId].dismissal = b.wicket_type || 'out'
        }
        
        fowList.push({
           wicketNumber: teamWickets,
           runs: teamRuns,
           player: batterStats[dismissedId]?.name || 'Unknown'
        })
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
    <div className="w-full max-w-4xl mx-auto mt-4 space-y-6">
      
      {/* Batting Table */}
      <div className="bg-bg-surface border border-bg-elevated rounded-xl overflow-hidden shadow-lg">
        <div className="bg-bg-elevated/40 px-4 py-2 font-black text-sm uppercase tracking-wider text-text-secondary border-b border-bg-elevated">
          Batting
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-text-primary whitespace-nowrap">
            <thead className="bg-bg-base/50 text-[10px] sm:text-xs uppercase text-text-muted">
              <tr>
                <th className="px-2 sm:px-4 py-2">Batter</th>
                <th className="px-2 sm:px-4 py-2 text-right">R</th>
                <th className="px-2 sm:px-4 py-2 text-right">B</th>
                <th className="px-2 sm:px-4 py-2 text-right">4s</th>
                <th className="px-2 sm:px-4 py-2 text-right">6s</th>
                <th className="px-2 sm:px-4 py-2 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-elevated/50">
              {batters.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center text-text-muted italic">No batting data yet.</td></tr>
              ) : (
                batters.map((b: any) => (
                  <tr key={b.id} className="hover:bg-bg-elevated/20 transition-colors">
                    <td className="px-2 sm:px-4 py-2">
                      <div className="font-bold text-text-primary truncate max-w-[110px] sm:max-w-[200px]">{b.name}</div>
                      <div className="text-[10px] text-text-muted capitalize truncate max-w-[110px] sm:max-w-[200px]">
                        {b.out ? (b.dismissal.replace('_', ' ')) : 'not out'}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-right font-black">{b.runs}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-text-secondary">{b.balls}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-text-secondary">{b.fours}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-text-secondary">{b.sixes}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-text-secondary">
                      {b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'}
                    </td>
                  </tr>
                ))
              )}
              {/* Extras Row */}
              {extras.total > 0 && (
                 <tr className="bg-bg-base/30 font-semibold">
                    <td className="px-2 sm:px-4 py-2">Extras</td>
                    <td colSpan={5} className="px-2 sm:px-4 py-2 text-right">
                       {extras.total} <span className="text-[10px] sm:text-xs text-text-muted font-normal">(W {extras.wide}, NB {extras.no_ball}, B {extras.bye}, LB {extras.leg_bye})</span>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {fow.length > 0 && (
        <div className="bg-bg-surface border border-bg-elevated rounded-xl p-4 shadow-lg text-sm">
          <div className="font-black text-xs uppercase tracking-wider text-text-secondary mb-3">Fall of Wickets</div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {fow.map((w: any, idx: number) => (
              <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center bg-bg-elevated/40 border border-border-dim rounded-lg p-3 min-w-[90px] transition-transform hover:-translate-y-1">
                <div className="text-[10px] text-text-muted font-bold mb-1 uppercase tracking-widest">Wkt {w.wicketNumber}</div>
                <div className="text-lg font-black text-brand-primary">{w.runs}</div>
                <div className="text-[11px] font-semibold text-text-secondary truncate w-full text-center mt-1" title={w.player}>{w.player}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bowling Table */}
      <div className="bg-bg-surface border border-bg-elevated rounded-xl overflow-hidden shadow-lg">
        <div className="bg-bg-elevated/40 px-4 py-2 font-black text-sm uppercase tracking-wider text-text-secondary border-b border-bg-elevated">
          Bowling
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-text-primary whitespace-nowrap">
            <thead className="bg-bg-base/50 text-[10px] sm:text-xs uppercase text-text-muted">
              <tr>
                <th className="px-2 sm:px-4 py-2">Bowler</th>
                <th className="px-2 sm:px-4 py-2 text-right">O</th>
                <th className="px-2 sm:px-4 py-2 text-right">M</th>
                <th className="px-2 sm:px-4 py-2 text-right">R</th>
                <th className="px-2 sm:px-4 py-2 text-right">W</th>
                <th className="px-2 sm:px-4 py-2 text-right">ECON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-elevated/50">
              {bowlers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center text-text-muted italic">No bowling data yet.</td></tr>
              ) : (
                bowlers.map((b: any) => (
                  <tr key={b.id} className="hover:bg-bg-elevated/20 transition-colors">
                    <td className="px-2 sm:px-4 py-2 font-bold truncate max-w-[110px] sm:max-w-[200px]">{b.name}</td>
                    <td className="px-2 sm:px-4 py-2 text-right font-medium">{b.oversDisplay}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-text-secondary">{b.maidens}</td>
                    <td className="px-2 sm:px-4 py-2 text-right font-medium">{b.runs}</td>
                    <td className="px-2 sm:px-4 py-2 text-right font-black text-brand-primary">{b.wickets}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-text-secondary">{b.eco}</td>
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
