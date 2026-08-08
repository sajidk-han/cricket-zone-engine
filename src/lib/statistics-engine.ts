import { createClient } from '@supabase/supabase-js'

export class StatisticsEngine {
  
  /**
   * Recalculates all player statistics for a specific tournament.
   * This populates `tournament_statistics` which powers the Leaderboards (Orange Cap, Purple Cap).
   */
  static async recalculateTournamentStatistics(orgId: string, tournamentId: string) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    // 1. Fetch all match stats for this tournament
    const { data: matches } = await supabase
      .from('matches')
      .select('id')
      .eq('tournament_id', tournamentId);
      
    if (!matches || matches.length === 0) return;
    const matchIds = matches.map(m => m.id);

    const { data: allStats } = await supabase
      .from('player_match_stats')
      .select('*')
      .in('match_id', matchIds);

    if (!allStats || allStats.length === 0) return;

    // 2. Aggregate stats per player
    const playerStats: Record<string, any> = {};

    for (const stat of allStats) {
      const pid = stat.player_id;
      if (!playerStats[pid]) {
        playerStats[pid] = {
          org_id: orgId,
          tournament_id: tournamentId,
          player_id: pid,
          team_id: stat.team_id, // assuming team doesn't change mid-tournament
          matches_played: 0,
          runs_scored: 0,
          balls_faced: 0,
          fours: 0,
          sixes: 0,
          highest_score: 0,
          not_outs: 0,
          wickets_taken: 0,
          runs_conceded: 0,
          balls_bowled: 0,
          maidens: 0,
          catches: 0,
          run_outs: 0
        };
      }

      const p = playerStats[pid];
      p.matches_played++;
      p.runs_scored += (stat.runs_scored || 0);
      p.balls_faced += (stat.balls_faced || 0);
      p.fours += (stat.fours || 0);
      p.sixes += (stat.sixes || 0);
      
      if ((stat.runs_scored || 0) > p.highest_score) {
         p.highest_score = stat.runs_scored;
      }
      
      p.wickets_taken += (stat.wickets_taken || 0);
      p.runs_conceded += (stat.runs_conceded || 0);
      
      // Convert overs_bowled (e.g. 4.0 or 3.2) to balls
      const overs = stat.overs_bowled || 0;
      const fullOvers = Math.floor(overs);
      const partialBalls = Math.round((overs - fullOvers) * 10);
      p.balls_bowled += (fullOvers * 6 + partialBalls);
      
      p.maidens += (stat.maidens || 0);
      p.catches += (stat.catches || 0);
    }

    // 3. Upsert to tournament_statistics
    const updates = Object.values(playerStats).map(p => ({
       ...p,
       updated_at: new Date().toISOString()
    }));

    const { error: upsertError } = await supabase
      .from('tournament_statistics')
      .upsert(updates, { onConflict: 'tournament_id, player_id' });
      
    if (upsertError) {
       console.error("Failed to upsert tournament statistics", upsertError);
    }
  }

  /**
   * Recalculates the permanent Career stats for a specific player across all tournaments.
   */
  static async updatePlayerCareerStats(orgId: string, playerId: string) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    const { data: allStats } = await supabase
      .from('player_match_stats')
      .select('*')
      .eq('player_id', playerId);
      
    if (!allStats) return;

    let total_matches = 0;
    let total_runs = 0;
    let total_wickets = 0;
    let highest_score = 0;
    let best_bowling_wickets = 0;
    let best_bowling_runs = 999;
    
    for (const stat of allStats) {
       total_matches++;
       total_runs += (stat.runs_scored || 0);
       total_wickets += (stat.wickets_taken || 0);
       
       if ((stat.runs_scored || 0) > highest_score) {
          highest_score = stat.runs_scored;
       }
       
       const w = stat.wickets_taken || 0;
       const r = stat.runs_conceded || 0;
       if (w > best_bowling_wickets || (w === best_bowling_wickets && r < best_bowling_runs)) {
          best_bowling_wickets = w;
          best_bowling_runs = r;
       }
    }
    
    const best_bowling_figures = best_bowling_wickets > 0 ? `${best_bowling_wickets}/${best_bowling_runs}` : null;

    const { error: upsertError } = await supabase
      .from('player_career_stats')
      .upsert({
         org_id: orgId,
         player_id: playerId,
         total_matches,
         total_runs,
         total_wickets,
         highest_score,
         best_bowling: best_bowling_figures,
         last_updated: new Date().toISOString()
      }, { onConflict: 'player_id' });

    if (upsertError) {
      console.error("Failed to upsert career stats:", upsertError)
      throw new Error(upsertError.message)
    }
  }
}
