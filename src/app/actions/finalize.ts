"use server"

import { MatchFinalizationEngine } from '@/lib/match-finalization-engine'

export async function finalizeMatchAction(matchId: string) {
  try {
    await MatchFinalizationEngine.finalizeMatch(matchId)
    return { success: true }
  } catch (error) {
    console.error("Failed to finalize match", error)
    return { success: false, error: String(error) }
  }
}
