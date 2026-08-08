export interface AnalyticsBall {
  overNumber: number; // 0-indexed (0 = 1st over)
  ballNumber: number; // 1 to 6
  runs: number; // total runs from this ball (bat + extras)
  isWicket: boolean;
  isLegal: boolean;
  teamId: string;
}

export interface WormDataPoint {
  over: number; // e.g., 1, 2, 3
  team1Runs?: number;
  team2Runs?: number;
}

export interface ManhattanDataPoint {
  over: number;
  runs: number;
  wickets: number;
}

/**
 * Generates cumulative runs per over for both teams
 */
export function generateWormData(balls: AnalyticsBall[], team1Id: string, team2Id: string): WormDataPoint[] {
  const overData: Record<number, { team1: number, team2: number }> = {};
  
  let team1Cumulative = 0;
  let team2Cumulative = 0;

  // Pre-fill up to max over to ensure line continues
  let maxOver = -1;
  balls.forEach(b => {
    if (b.overNumber > maxOver) maxOver = b.overNumber;
  });

  for (let i = 0; i <= maxOver; i++) {
    overData[i] = { team1: 0, team2: 0 };
  }

  // Aggregate runs per over per team
  balls.forEach(ball => {
    if (ball.teamId === team1Id) {
      overData[ball.overNumber].team1 += ball.runs;
    } else if (ball.teamId === team2Id) {
      overData[ball.overNumber].team2 += ball.runs;
    }
  });

  const result: WormDataPoint[] = [];
  
  // Make cumulative
  for (let i = 0; i <= maxOver; i++) {
    team1Cumulative += overData[i]?.team1 || 0;
    team2Cumulative += overData[i]?.team2 || 0;
    
    result.push({
      over: i + 1,
      team1Runs: team1Cumulative,
      team2Runs: team2Cumulative
    });
  }

  // Always start from 0,0
  return [{ over: 0, team1Runs: 0, team2Runs: 0 }, ...result];
}

/**
 * Generates per-over runs and wickets for a single team's innings
 */
export function generateManhattanData(balls: AnalyticsBall[], teamId: string): ManhattanDataPoint[] {
  const overData: Record<number, { runs: number, wickets: number }> = {};
  let maxOver = -1;

  balls.forEach(ball => {
    if (ball.teamId !== teamId) return;
    
    if (ball.overNumber > maxOver) maxOver = ball.overNumber;
    
    if (!overData[ball.overNumber]) {
      overData[ball.overNumber] = { runs: 0, wickets: 0 };
    }
    
    overData[ball.overNumber].runs += ball.runs;
    if (ball.isWicket) {
      overData[ball.overNumber].wickets += 1;
    }
  });

  const result: ManhattanDataPoint[] = [];
  for (let i = 0; i <= maxOver; i++) {
    result.push({
      over: i + 1,
      runs: overData[i]?.runs || 0,
      wickets: overData[i]?.wickets || 0
    });
  }

  return result;
}
