import { MatchData, MatchOutcome, processMatchResult } from './match-result-engine';

export interface TournamentScoringRules {
  win_points: number;
  tie_points: number;
  no_result_points: number;
  loss_points: number;
  super_over_win_points?: number;
}

const DEFAULT_SCORING_RULES: TournamentScoringRules = {
  win_points: 2,
  tie_points: 1,
  no_result_points: 1,
  loss_points: 0,
  super_over_win_points: 2, // Usually same as win
};

export interface TeamStandingData {
  team_id: string;
  team_name: string;
  logo_url: string | null;
  played: number;
  won: number;
  lost: number;
  tied: number;
  no_result: number;
  points: number;
  runs_for: number;
  overs_for: number;
  runs_against: number;
  overs_against: number;
  nrr: number;
  position: number;
}

/**
 * Core Standings Engine
 * Separated from UI and Database. Calculates the exact points table.
 */
export function calculateStandings(
  teams: Array<{ id: string; name: string; logo_url: string | null }>,
  matches: MatchData[],
  rules?: Partial<TournamentScoringRules>
): TeamStandingData[] {
  
  const scoringRules = { ...DEFAULT_SCORING_RULES, ...rules };
  
  // 1. Initialize standings dictionary
  const standingsMap = new Map<string, TeamStandingData>();
  
  for (const team of teams) {
    standingsMap.set(team.id, {
      team_id: team.id,
      team_name: team.name,
      logo_url: team.logo_url,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      no_result: 0,
      points: 0,
      runs_for: 0,
      overs_for: 0.0,
      runs_against: 0,
      overs_against: 0.0,
      nrr: 0.000,
      position: 0
    });
  }

  // 2. Process each match
  for (const match of matches) {
    const outcome = processMatchResult(match);
    
    if (!outcome.is_valid_for_standings) continue;

    const t1 = standingsMap.get(outcome.team1_id);
    const t2 = standingsMap.get(outcome.team2_id);

    // If teams are not part of this specific group/stage, skip (can happen if teams are omitted from input)
    if (t1) applyOutcome(t1, outcome.team1_result, scoringRules);
    if (t2) applyOutcome(t2, outcome.team2_result, scoringRules);
  }

  // 3. Convert to array and sort
  const standingsArray = Array.from(standingsMap.values());
  
  standingsArray.sort((a, b) => {
    // 1st Priority: Points
    if (b.points !== a.points) return b.points - a.points;
    
    // 2nd Priority: NRR
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    
    // 3rd Priority: Wins
    if (b.won !== a.won) return b.won - a.won;
    
    // 4th Priority: Name ASC
    return a.team_name.localeCompare(b.team_name);
  });

  // 4. Assign positions
  standingsArray.forEach((standing, index) => {
    standing.position = index + 1;
  });

  return standingsArray;
}

function applyOutcome(team: TeamStandingData, result: MatchOutcome['team1_result'], rules: TournamentScoringRules) {
  // If result is pending, don't increment played (match hasn't happened)
  if (result === 'pending') return;

  team.played += 1;

  switch (result) {
    case 'win':
      team.won += 1;
      team.points += rules.win_points;
      break;
    case 'super_over_win':
      team.won += 1;
      team.points += (rules.super_over_win_points ?? rules.win_points);
      break;
    case 'loss':
      team.lost += 1;
      team.points += rules.loss_points;
      break;
    case 'tie':
    case 'draw':
      team.tied += 1;
      team.points += rules.tie_points;
      break;
    case 'no_result':
    case 'abandoned':
      team.no_result += 1;
      team.points += rules.no_result_points;
      // In some leagues, abandoned matches don't count towards played.
      // But usually they do count as a point-sharing event. We'll keep it counted.
      break;
  }
}
