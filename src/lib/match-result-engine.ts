/**
 * Match Result Engine
 * Processes a match to determine its result and outcomes for both teams.
 */

export type MatchResultType = 'win' | 'loss' | 'tie' | 'no_result' | 'abandoned' | 'draw' | 'super_over_win' | 'pending';

export interface MatchOutcome {
  team1_result: MatchResultType;
  team2_result: MatchResultType;
  team1_id: string;
  team2_id: string;
  is_valid_for_standings: boolean;
}

export interface MatchData {
  id: string;
  team1_id: string;
  team2_id: string;
  status: string; // completed, verified, archived, draft, scheduled, live
  winning_team_id: string | null;
  result_type: string | null; // e.g., 'tie', 'no_result', 'abandoned', 'normal', 'super_over'
}

/**
 * Validates if a match should be included in the standings.
 * Only verified, completed, and archived matches count.
 */
export function isValidForStandings(status: string): boolean {
  return ['completed', 'verified', 'archived'].includes(status.toLowerCase());
}

/**
 * Calculates the outcome for both teams based on match data.
 */
export function processMatchResult(match: MatchData): MatchOutcome {
  const valid = isValidForStandings(match.status);
  
  const outcome: MatchOutcome = {
    team1_result: 'pending',
    team2_result: 'pending',
    team1_id: match.team1_id,
    team2_id: match.team2_id,
    is_valid_for_standings: valid,
  };

  if (!valid) {
    return outcome;
  }

  // Handle explicit result types (No Result, Abandoned, Tie)
  if (match.result_type) {
    const type = match.result_type.toLowerCase();
    if (type === 'no_result' || type === 'abandoned') {
      outcome.team1_result = type === 'abandoned' ? 'abandoned' : 'no_result';
      outcome.team2_result = type === 'abandoned' ? 'abandoned' : 'no_result';
      return outcome;
    }
    
    if (type === 'tie' || type === 'draw') {
      outcome.team1_result = type === 'draw' ? 'draw' : 'tie';
      outcome.team2_result = type === 'draw' ? 'draw' : 'tie';
      return outcome;
    }
  }

  // Handle Wins/Losses
  if (match.winning_team_id) {
    const isSuperOver = match.result_type?.toLowerCase() === 'super_over';
    
    if (match.winning_team_id === match.team1_id) {
      outcome.team1_result = isSuperOver ? 'super_over_win' : 'win';
      outcome.team2_result = 'loss';
    } else if (match.winning_team_id === match.team2_id) {
      outcome.team1_result = 'loss';
      outcome.team2_result = isSuperOver ? 'super_over_win' : 'win';
    }
    return outcome;
  }

  // Fallback if marked completed but no winner or specific result type
  // This typically means the match is drawn or no result in a default scenario
  outcome.team1_result = 'no_result';
  outcome.team2_result = 'no_result';
  return outcome;
}
