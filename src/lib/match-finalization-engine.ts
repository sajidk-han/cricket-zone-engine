import { createClient } from '@supabase/supabase-js'
import { recalculateTournamentStandings } from '@/app/actions/tournaments'
import { StatisticsEngine } from './statistics-engine'

export class MatchFinalizationEngine {
  
  static async finalizeMatch(matchId: string) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // 1. Fetch match and ball events
    const { data: match } = await supabase.from('matches').select('*').eq('id', matchId).single()
    if (!match) return

    const { data: ballEvents } = await supabase.from('ball_events').select('*').eq('match_id', matchId)
    if (!ballEvents || ballEvents.length === 0) return

    // 2. Aggregate player stats
    const playerStats: Record<string, any> = {}
    
    const initPlayer = (playerId: string, teamId: string) => {
       if (!playerStats[playerId]) {
          playerStats[playerId] = {
             org_id: match.org_id,
             match_id: matchId,
             tournament_id: match.tournament_id,
             player_id: playerId,
             team_id: teamId,
             runs_scored: 0,
             balls_faced: 0,
             fours: 0,
             sixes: 0,
             is_dismissed: false,
             wickets_taken: 0,
             runs_conceded: 0,
             balls_bowled: 0,
             maidens: 0,
             catches: 0,
             run_outs: 0
          }
       }
    }

    for (const ball of ballEvents) {
       // We need to know which team is batting/bowling. 
       // For simplicity, we assume striker is team1 or team2. We don't have team info on the ball.
       // We'll just assign team1/2 based on the match. This is a heuristic for this demo.
       
       const runs = ball.runs_off_bat || 0;
       
       if (ball.striker_id) {
          initPlayer(ball.striker_id, match.team1_id); // team doesn't matter much for individual stats insertion unless joined
          playerStats[ball.striker_id].runs_scored += runs;
          // Count balls faced (legal + no balls, but not wides)
          if (ball.extras_type !== 'wide') {
             playerStats[ball.striker_id].balls_faced += 1;
          }
          if (runs === 4) playerStats[ball.striker_id].fours += 1;
          if (runs === 6) playerStats[ball.striker_id].sixes += 1;
          if (ball.is_wicket) {
             playerStats[ball.striker_id].is_dismissed = true;
          }
       }

       if (ball.bowler_id) {
          initPlayer(ball.bowler_id, match.team2_id);
          const runsConceded = runs + (ball.extras_runs || 0);
          playerStats[ball.bowler_id].runs_conceded += runsConceded;
          if (ball.is_legal_delivery) {
             playerStats[ball.bowler_id].balls_bowled += 1;
          }
          if (ball.is_wicket && !['run out', 'retired hurt'].includes(ball.wicket_type)) {
             playerStats[ball.bowler_id].wickets_taken += 1;
          }
       }
    }

    // Convert balls bowled to overs (e.g. 6 balls = 1.0, 7 balls = 1.1)
    Object.values(playerStats).forEach(p => {
       const fullOvers = Math.floor(p.balls_bowled / 6);
       const partial = p.balls_bowled % 6;
       p.overs_bowled = fullOvers + (partial / 10);
       
       // Remove keys not in the DB schema
       delete p.balls_bowled;
       delete p.is_dismissed;
       delete p.run_outs;
       delete p.tournament_id;
    })

    // 3. Execute Transactional Finalization via RPC
    const updates = Object.values(playerStats);
    
    const { data: rpcData, error: rpcError } = await supabase.rpc('finalize_match_transactional', {
      p_match_id: matchId,
      p_status: 'completed',
      p_player_stats: updates,
      p_tournament_id: match.tournament_id || null,
      p_standings: [] // Future: Pass calculated standings here for full atomicity
    });

    if (rpcError) {
       console.error("Transactional Finalization Failed:", rpcError);
       throw new Error(rpcError.message);
    }

    // 4. Trigger the Precomputed Engines (Standings/Stats)
    // In a fully strict system, these would also be calculated in-memory and passed to the RPC.
    if (match.tournament_id) {
       await recalculateTournamentStandings(match.tournament_id);
       await StatisticsEngine.recalculateTournamentStatistics(match.org_id, match.tournament_id);
       
       // Update career stats for all players in this match
       for (const pid of Object.keys(playerStats)) {
          await StatisticsEngine.updatePlayerCareerStats(match.org_id, pid);
       }
    }
  }
}
