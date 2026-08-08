// lib/scoring-engine.ts

export type MatchState = {
  totalRuns: number
  totalWickets: number
  legalBallsBowled: number // Total legal deliveries in the innings
  currentStrikerId: string
  currentNonStrikerId: string
  currentBowlerId: string
}

export type DeliveryEvent = {
  runsOffBat: number
  isLegalDelivery: boolean
  isBoundary: boolean
  extrasType?: string | null // 'wide', 'no_ball', 'bye', 'leg_bye', 'penalty'
  extrasRuns: number
  isWicket: boolean
  wicketType?: string | null // 'bowled', 'caught', 'run_out', etc.
  dismissedPlayerId?: string | null // Id of the player who got out
  incomingBatterId?: string | null // Id of the new batter replacing the dismissed one
}

export type ScoringResult = {
  newState: MatchState
}

/**
 * Shared deterministic scoring engine.
 * Computes the exact next state of the match given a delivery event.
 * Used by BOTH the client (Offline Reducer) and server (Validation).
 */
export function calculateNextMatchState(
  currentState: MatchState,
  event: DeliveryEvent
): ScoringResult {
  // 1. Calculate Totals
  const runsThisBall = event.runsOffBat + event.extrasRuns
  const newTotalRuns = currentState.totalRuns + runsThisBall
  const newTotalWickets = currentState.totalWickets + (event.isWicket ? 1 : 0)
  
  const newLegalBallsBowled = currentState.legalBallsBowled + (event.isLegalDelivery ? 1 : 0)

  // 2. Resolve Wicket (if applicable)
  let nextStriker = currentState.currentStrikerId
  let nextNonStriker = currentState.currentNonStrikerId

  if (event.isWicket && event.incomingBatterId && event.dismissedPlayerId) {
    if (event.dismissedPlayerId === currentState.currentStrikerId) {
      nextStriker = event.incomingBatterId
    } else if (event.dismissedPlayerId === currentState.currentNonStrikerId) {
      nextNonStriker = event.incomingBatterId
    }
  }

  // 3. Calculate Strike Rotation
  // Batters run on runs off the bat, byes, and leg_byes. 
  // Wides/No-Balls runs generally don't rotate strike unless they ran for it.
  // In our simplified engine, we assume extrasRuns for wide/no-ball are total extras.
  // We'll rotate based on total runs ran by batters.
  const runsForRotation = event.runsOffBat + (event.extrasType === 'bye' || event.extrasType === 'leg_bye' ? event.extrasRuns : 0)
  let shouldRotate = runsForRotation % 2 !== 0

  // 4. End of Over Rotation
  // If the delivery is legal, check if it completes the over.
  if (event.isLegalDelivery) {
    const isOverComplete = newLegalBallsBowled % 6 === 0
    if (isOverComplete) {
      shouldRotate = !shouldRotate
    }
  }

  // 5. Apply Rotation
  if (shouldRotate) {
    const temp = nextStriker
    nextStriker = nextNonStriker
    nextNonStriker = temp
  }

  return {
    newState: {
      totalRuns: newTotalRuns,
      totalWickets: newTotalWickets,
      legalBallsBowled: newLegalBallsBowled,
      currentStrikerId: nextStriker,
      currentNonStrikerId: nextNonStriker,
      currentBowlerId: currentState.currentBowlerId, // Bowler change handled by UI explicitly
    }
  }
}
