import { DeliveryPayload } from '@/app/actions/scoring'
import { MatchState } from './scoring-engine'

/**
 * Commentary Engine generates dynamic text descriptions of a delivery based on its payload.
 */
export class CommentaryEngine {
  
  static generateBallCommentary(
    overNumber: number,
    ballNumber: number,
    payload: DeliveryPayload,
    strikerName: string,
    bowlerName: string,
    matchState?: MatchState
  ): string {
    const ballStr = `${overNumber}.${ballNumber}`;
    
    // 1. Handle Wickets
    if (payload.isWicket) {
       let how = '';
       if (payload.wicketType === 'bowled') how = `bowled him! What a delivery by ${bowlerName}.`;
       else if (payload.wicketType === 'caught') how = `in the air... and caught! ${strikerName} departs.`;
       else if (payload.wicketType === 'lbw') how = `huge appeal, and the finger goes up! Trapped in front.`;
       else if (payload.wicketType === 'run out') how = `direct hit! And he's gone! Run out.`;
       else if (payload.wicketType === 'stumped') how = `dragged his foot out, easy stumping.`;
       else how = `OUT! ${payload.wicketType}.`;
       
       return `${ballStr} OUT! ${how} ${strikerName} has to walk back.`;
    }

    // 2. Handle Boundaries
    if (payload.isBoundary) {
       if (payload.runsOffBat === 4) {
          return `${ballStr} FOUR! Beautifully timed by ${strikerName}. Pierces the gap for four runs!`;
       } else if (payload.runsOffBat === 6) {
          return `${ballStr} SIX! Massive hit! ${strikerName} launches it into the stands.`;
       }
    }

    // 3. Handle Extras
    if (payload.extrasType) {
       let ext = '';
       if (payload.extrasType === 'wide') ext = 'Wide ball down the leg side.';
       if (payload.extrasType === 'no_ball') ext = 'No ball called! Free hit coming up.';
       if (payload.extrasType === 'bye') ext = `${payload.extrasRuns} byes stolen.`;
       if (payload.extrasType === 'leg_bye') ext = `Off the pads, ${payload.extrasRuns} leg byes.`;
       if (payload.extrasType === 'penalty') ext = `Penalty runs awarded.`;
       
       return `${ballStr} ${ext}`;
    }

    // 4. Handle Normal Runs
    if (payload.runsOffBat === 0) {
       return `${ballStr} Dot ball. Solid defense by ${strikerName} off ${bowlerName}'s bowling.`;
    } else if (payload.runsOffBat === 1) {
       return `${ballStr} Tapped into the gap for a single. Good running.`;
    } else if (payload.runsOffBat === 2) {
       return `${ballStr} Worked away nicely, they push hard and come back for two.`;
    } else if (payload.runsOffBat === 3) {
       return `${ballStr} Excellent running between the wickets, they manage to get three.`;
    } else {
       return `${ballStr} ${payload.runsOffBat} runs. Good aggressive running by ${strikerName}.`;
    }
  }

}
