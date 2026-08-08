import { createClient } from '@supabase/supabase-js'

export interface TournamentPointsConfig {
  points_win: number;
  points_loss: number;
  points_tie: number;
  points_no_result: number;
  points_bonus: number;
}

export const DEFAULT_POINTS_CONFIG: TournamentPointsConfig = {
  points_win: 2,
  points_loss: 0,
  points_tie: 1,
  points_no_result: 1,
  points_bonus: 0
}

export class StandingsEngine {
  /**
   * Converts cricket over format (e.g., 19.4) to decimal overs (e.g., 19.666...)
   */
  static oversToDecimal(overs: number): number {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return fullOvers + (balls / 6);
  }

  /**
   * Mathematically calculates Net Run Rate
   * NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
   * Note: If a team is all out, the overs faced should be the maximum allocated overs for the innings.
   */
  static calculateNRR(runsFor: number, oversFaced: number, runsAgainst: number, oversBowled: number): number {
    const decimalOversFaced = this.oversToDecimal(oversFaced);
    const decimalOversBowled = this.oversToDecimal(oversBowled);
    
    const runRateFor = decimalOversFaced > 0 ? runsFor / decimalOversFaced : 0;
    const runRateAgainst = decimalOversBowled > 0 ? runsAgainst / decimalOversBowled : 0;
    
    return Number((runRateFor - runRateAgainst).toFixed(3));
  }

  /**
   * Recalculates the entire standings table for a tournament from scratch.
   * This ensures absolute consistency (no drift).
   */
  static async recalculateTournamentStandings(orgId: string, tournamentId: string, config: TournamentPointsConfig = DEFAULT_POINTS_CONFIG) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    // 1. Fetch all matches for this tournament
    const { data: matches, error } = await supabase
      .from('matches')
      .select('id, team1_id, team2_id, status, winning_team_id')
      .eq('tournament_id', tournamentId);
      
    if (error || !matches) {
      console.error("Failed to fetch matches for standings", error);
      return;
    }

    // 2. Fetch all innings for these matches to compute runs and overs
    const matchIds = matches.map(m => m.id);
    let allInnings: any[] = [];
    if (matchIds.length > 0) {
      const { data: inningsData } = await supabase
        .from('innings')
        .select('*')
        .in('match_id', matchIds);
      if (inningsData) allInnings = inningsData;
    }

    // Initialize team stats map
    const teamStats: Record<string, any> = {};
    const initTeam = (teamId: string) => {
      if (!teamStats[teamId]) {
        teamStats[teamId] = {
          matches_played: 0,
          matches_won: 0,
          matches_lost: 0,
          matches_tied: 0,
          no_result: 0,
          points: 0,
          runs_for: 0,
          overs_faced: 0.0,
          runs_against: 0,
          overs_bowled: 0.0
        };
      }
    };

    // 3. Process each match
    for (const match of matches) {
      const t1 = match.team1_id;
      const t2 = match.team2_id;
      initTeam(t1);
      initTeam(t2);

      teamStats[t1].matches_played++;
      teamStats[t2].matches_played++;

      // Match Result
      if (match.status === 'completed') {
        if (match.winning_team_id === t1) {
          teamStats[t1].matches_won++;
          teamStats[t1].points += config.points_win;
          teamStats[t2].matches_lost++;
          teamStats[t2].points += config.points_loss;
        } else if (match.winning_team_id === t2) {
          teamStats[t2].matches_won++;
          teamStats[t2].points += config.points_win;
          teamStats[t1].matches_lost++;
          teamStats[t1].points += config.points_loss;
        }
      } else if (match.status === 'tied') {
        teamStats[t1].matches_tied++;
        teamStats[t2].matches_tied++;
        teamStats[t1].points += config.points_tie;
        teamStats[t2].points += config.points_tie;
      } else if (match.status === 'abandoned') {
        teamStats[t1].no_result++;
        teamStats[t2].no_result++;
        teamStats[t1].points += config.points_no_result;
        teamStats[t2].points += config.points_no_result;
      }

      // NRR Calculation (Runs and Overs)
      const matchInnings = allInnings.filter(i => i.match_id === match.id);
      for (const inning of matchInnings) {
        const battingTeamId = inning.batting_team_id;
        const bowlingTeamId = battingTeamId === t1 ? t2 : t1;
        
        // If team was all out, they effectively faced their maximum quota (e.g. 20 overs)
        // For simplicity in this engine, we just use overs_bowled. If we had allocated_overs, we'd use that.
        // E.g., if a team is all out in 15.2 overs in a T20, NRR logic says they faced 20 overs.
        // We will assume overs_bowled from the inning record is accurate to what should be counted.
        const runs = inning.total_runs || 0;
        const overs = inning.overs_bowled || 0;

        teamStats[battingTeamId].runs_for += runs;
        teamStats[battingTeamId].overs_faced = this.addOvers(teamStats[battingTeamId].overs_faced, overs);
        
        teamStats[bowlingTeamId].runs_against += runs;
        teamStats[bowlingTeamId].overs_bowled = this.addOvers(teamStats[bowlingTeamId].overs_bowled, overs);
      }
    }

    // 4. Calculate NRR and save to DB
    for (const teamId in teamStats) {
      const stats = teamStats[teamId];
      stats.net_run_rate = this.calculateNRR(
        stats.runs_for, stats.overs_faced,
        stats.runs_against, stats.overs_bowled
      );

      // Upsert into tournament_standings
      await supabase
        .from('tournament_standings')
        .upsert({
          org_id: orgId,
          tournament_id: tournamentId,
          team_id: teamId,
          ...stats,
          updated_at: new Date().toISOString()
        }, { onConflict: 'tournament_id, team_id' });
    }
  }

  /**
   * Helper to add two cricket over representations (e.g., 19.4 + 2.3 = 22.1)
   */
  static addOvers(o1: number, o2: number): number {
    const balls1 = Math.floor(o1) * 6 + Math.round((o1 % 1) * 10);
    const balls2 = Math.floor(o2) * 6 + Math.round((o2 % 1) * 10);
    const totalBalls = balls1 + balls2;
    return Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
  }
}
