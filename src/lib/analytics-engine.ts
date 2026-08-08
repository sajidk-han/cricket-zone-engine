import { MatchState } from './scoring-engine'

export type WormDataPoint = {
  over: number;
  team1Runs: number | null;
  team2Runs: number | null;
}

export type ManhattanDataPoint = {
  over: number;
  team1RunsPerOver: number | null;
  team2RunsPerOver: number | null;
}

export class AnalyticsEngine {
  
  /**
   * Processes raw ball events into a cumulative run dataset (Worm Graph).
   */
  static generateWormGraphData(team1Id: string, team2Id: string, allBalls: any[], targetOvers: number = 20): WormDataPoint[] {
    const data: WormDataPoint[] = [];
    
    // Initialize points
    data.push({ over: 0, team1Runs: 0, team2Runs: 0 });

    let t1Cumulative = 0;
    let t2Cumulative = 0;

    for (let i = 1; i <= targetOvers; i++) {
       // Filter balls for this over
       const t1Balls = allBalls.filter(b => b.innings.batting_team_id === team1Id && b.over_number === i - 1);
       const t2Balls = allBalls.filter(b => b.innings.batting_team_id === team2Id && b.over_number === i - 1);

       if (t1Balls.length > 0) {
           t1Cumulative += t1Balls.reduce((acc, b) => acc + b.runs_off_bat + b.extras_runs, 0);
       }
       if (t2Balls.length > 0) {
           t2Cumulative += t2Balls.reduce((acc, b) => acc + b.runs_off_bat + b.extras_runs, 0);
       }

       data.push({ 
           over: i, 
           team1Runs: t1Balls.length > 0 ? t1Cumulative : null, 
           team2Runs: t2Balls.length > 0 ? t2Cumulative : null 
       });
    }

    return data;
  }

  /**
   * Processes raw ball events into per-over runs dataset (Manhattan Graph).
   */
  static generateManhattanGraphData(team1Id: string, team2Id: string, allBalls: any[], targetOvers: number = 20): ManhattanDataPoint[] {
    const data: ManhattanDataPoint[] = [];

    for (let i = 1; i <= targetOvers; i++) {
       const t1Balls = allBalls.filter(b => b.innings.batting_team_id === team1Id && b.over_number === i - 1);
       const t2Balls = allBalls.filter(b => b.innings.batting_team_id === team2Id && b.over_number === i - 1);

       const t1Runs = t1Balls.length > 0 ? t1Balls.reduce((acc, b) => acc + b.runs_off_bat + b.extras_runs, 0) : null;
       const t2Runs = t2Balls.length > 0 ? t2Balls.reduce((acc, b) => acc + b.runs_off_bat + b.extras_runs, 0) : null;

       data.push({
           over: i,
           team1RunsPerOver: t1Runs,
           team2RunsPerOver: t2Runs
       });
    }

    return data;
  }
}
