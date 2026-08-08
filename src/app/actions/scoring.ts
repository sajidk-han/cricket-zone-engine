"use server"

import { createClient } from '@/lib/supabase-server'
import { getDefaultOrgId } from '@/app/actions/org'
import { revalidatePath } from 'next/cache'
import { calculateNextMatchState } from '@/lib/scoring-engine'

export async function initializeInnings(
  matchId: string, 
  battingTeamId: string, 
  bowlingTeamId: string, 
  inningsNumber: number, 
  strikerId: string, 
  nonStrikerId: string, 
  bowlerId: string
) {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()

    // 1. Insert Innings Record
    const { data: innings, error: inningsError } = await supabase
      .from('innings')
      .insert([{
        org_id: orgId,
        match_id: matchId,
        batting_team_id: battingTeamId,
        bowling_team_id: bowlingTeamId,
        innings_number: inningsNumber,
        total_runs: 0,
        total_wickets: 0,
        overs_bowled: 0.0,
        is_completed: false
      }])
      .select()
      .single()

    // 2. Insert match_event with initial players as JSON in description
    const initData = JSON.stringify({
      innings_id: innings.id,
      striker_id: strikerId,
      non_striker_id: nonStrikerId,
      bowler_id: bowlerId
    })

    const { error: eventError } = await supabase
      .from('match_events')
      .insert([{
        match_id: matchId,
        event_type: 'innings_start',
        description: initData
      }])

    if (eventError) console.error("Failed to log match event", eventError)

    revalidatePath(`/matches/${matchId}/dashboard`)
    return { success: true, message: "Innings initialized successfully", data: innings }

  } catch (error: any) {
    console.error("initializeInnings error", error)
    return { success: false, message: "Failed to initialize innings" }
  }
}

export type DeliveryPayload = {
  runsOffBat: number
  isLegalDelivery: boolean
  isBoundary: boolean
  extrasType?: string | null
  extrasRuns: number
  isWicket: boolean
  wicketType?: string | null
  dismissedPlayerId?: string | null
  incomingBatterId?: string | null
}

export async function scoreDelivery(
  matchId: string,
  inningsId: string,
  requestId: string,
  clientVersion: number,
  strikerId: string,
  nonStrikerId: string,
  bowlerId: string,
  payload: DeliveryPayload
) {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()

    // 1. Call Atomic RPC Transaction
    const { data, error } = await supabase.rpc('score_delivery', {
      p_request_id: requestId,
      p_match_id: matchId,
      p_innings_id: inningsId,
      p_striker_id: strikerId,
      p_non_striker_id: nonStrikerId,
      p_bowler_id: bowlerId,
      p_runs_off_bat: payload.runsOffBat,
      p_extras_type: payload.extrasType || null,
      p_extras_runs: payload.extrasRuns || 0,
      p_is_legal_delivery: payload.isLegalDelivery,
      p_is_wicket: payload.isWicket,
      p_wicket_type: payload.wicketType || null,
      p_client_version: clientVersion
    })

    if (error) {
      console.error("score_delivery RPC error:", error)
      return { success: false, message: `DB Error: ${error.message || 'Transaction failed.'}` }
    }

    if (!data.success) {
      return { success: false, message: data.message }
    }

    // 2. Fetch current state to run through Shared Scoring Engine
    const { data: innings, error: inningsError } = await supabase
      .from('innings')
      .select('*')
      .eq('id', inningsId)
      .single()

    if (inningsError || !innings) throw new Error("Innings not found")

    const { count: legalBallsCount } = await supabase
      .from('ball_events')
      .select('*', { count: 'exact', head: true })
      .eq('innings_id', inningsId)
      .eq('is_legal_delivery', true)
      
    // The previous legal balls count is the current minus 1 if this delivery was legal,
    // because the RPC already inserted the ball_event.
    const previousLegalBalls = (legalBallsCount || 0) - (payload.isLegalDelivery ? 1 : 0)

    const currentState = {
      totalRuns: innings.total_runs, // Assuming innings total_runs wasn't updated by RPC
      totalWickets: innings.total_wickets,
      legalBallsBowled: previousLegalBalls,
      currentStrikerId: strikerId,
      currentNonStrikerId: nonStrikerId,
      currentBowlerId: bowlerId
    }

    const { newState } = calculateNextMatchState(currentState, {
      runsOffBat: payload.runsOffBat,
      isLegalDelivery: payload.isLegalDelivery,
      isBoundary: payload.isBoundary,
      extrasType: payload.extrasType || null,
      extrasRuns: payload.extrasRuns,
      isWicket: payload.isWicket,
      wicketType: payload.wicketType || null,
      dismissedPlayerId: payload.dismissedPlayerId || null,
      incomingBatterId: payload.incomingBatterId || null
    })

    // 3. Update Innings totals with deterministic Engine results
    const remainingBalls = newState.legalBallsBowled % 6
    const oversBowled = Math.floor(newState.legalBallsBowled / 6) + (remainingBalls / 10)

    const { error: updateError } = await supabase
      .from('innings')
      .update({
        total_runs: newState.totalRuns,
        total_wickets: newState.totalWickets,
        overs_bowled: oversBowled
      })
      .eq('id', inningsId)

    if (updateError) {
      console.error("Failed to update innings", updateError)
      return { success: false, message: "Failed to update innings score" }
    }

    // 4. Fetch the authoritative stats for the active players to broadcast via match_statistics
    const strikerStats = await fetchBatterStats(inningsId, newState.currentStrikerId)
    const nonStrikerStats = await fetchBatterStats(inningsId, newState.currentNonStrikerId)
    const bowlerStats = await fetchBowlerStats(inningsId, newState.currentBowlerId)

    // 5. Update Match Snapshot for Wickets & Strike Rotation using Engine Results
    await supabase.from('matches').update({
      match_statistics: {
        current_striker: newState.currentStrikerId,
        current_non_striker: newState.currentNonStrikerId,
        current_bowler: newState.currentBowlerId, // UI handles next bowler
        striker_stats: strikerStats,
        non_striker_stats: nonStrikerStats,
        bowler_stats: bowlerStats,
        last_update: new Date().toISOString()
      }
    }).eq('id', matchId)

    revalidatePath(`/matches/${matchId}/dashboard`)
    return { success: true, message: "Delivery recorded" }

  } catch (error: any) {
    console.error("scoreDelivery error", error)
    return { success: false, message: "An error occurred while scoring" }
  }
}

async function fetchBatterStats(inningsId: string, batterId: string | undefined) {
  if (!inningsId || !batterId) return { runs: 0, balls: 0, fours: 0, sixes: 0 }
  const supabase = await createClient()
  const { data } = await supabase.from('ball_events').select('runs_off_bat, extras_type').eq('innings_id', inningsId).eq('striker_id', batterId)
    
  let runs = 0; let balls = 0; let fours = 0; let sixes = 0;
  if (data) {
    data.forEach(d => {
      runs += d.runs_off_bat;
      if (d.runs_off_bat === 4) fours++;
      if (d.runs_off_bat === 6) sixes++;
      if (d.extras_type !== 'wide') balls++;
    })
  }
  return { runs, balls, fours, sixes }
}

async function fetchBowlerStats(inningsId: string, bowlerId: string | undefined) {
  if (!inningsId || !bowlerId) return { overs: 0, maidens: 0, runs: 0, wickets: 0, dots: 0, totalBalls: 0 }
  const supabase = await createClient()
  const { data } = await supabase.from('ball_events').select('*').eq('innings_id', inningsId).eq('bowler_id', bowlerId)
  
  let runs = 0; let wickets = 0; let dots = 0; let totalBalls = 0;
  if (data) {
    data.forEach(d => {
      runs += d.runs_off_bat + d.extras_runs;
      if (d.is_wicket && !['run_out', 'obstructing_field', 'retired_hurt'].includes(d.wicket_type || '')) {
        wickets++;
      }
      if (d.runs_off_bat === 0 && d.extras_runs === 0 && !d.is_wicket) {
        dots++;
      }
      if (d.is_legal_delivery) totalBalls++;
    })
  }
  const overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
  return { overs, maidens: 0, runs, wickets, dots, totalBalls }
}



export async function resetInnings(matchId: string) {
  const supabase = await createClient()
  await supabase.from('innings').delete().eq('match_id', matchId)
  await supabase.from('matches').update({ status: 'scheduled' }).eq('id', matchId)
  revalidatePath(`/matches/${matchId}/dashboard`)
}

export async function undoLastBall(matchId: string, inningsId: string, clientVersion: number, reason: string = 'Manual Undo') {
  try {
    const supabase = await createClient();
    
    // 1. Verify Match Version (Optimistic Locking)
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('current_version')
      .eq('id', matchId)
      .single();
      
    if (matchError || !match) return { success: false, message: 'Match not found' };
    
    if (clientVersion < match.current_version - 1) {
      return { success: false, message: 'Conflict: Match state has changed significantly. Please refresh.' };
    }

    // 2. Find the last ball physically
    const { data: lastBall, error: lastBallError } = await supabase
      .from('ball_events')
      .select('*')
      .eq('innings_id', inningsId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastBallError || !lastBall) {
      return { success: false, message: 'No active delivery found to undo.' };
    }

    // 3. Delete the last ball physically
    await supabase.from('ball_events').delete().eq('id', lastBall.id);

    // 4. Fetch all remaining balls to recalculate Innings
    const { data: remainingBalls } = await supabase
      .from('ball_events')
      .select('*')
      .eq('innings_id', inningsId)
      .order('created_at', { ascending: true });

    let totalRuns = 0;
    let totalWickets = 0;
    let totalLegalBalls = 0;

    if (remainingBalls) {
       remainingBalls.forEach(b => {
          totalRuns += b.runs_off_bat + b.extras_runs;
          if (b.is_wicket) totalWickets++;
          if (b.is_legal_delivery) totalLegalBalls++;
       });
    }

    const remOvers = totalLegalBalls % 6;
    const oversBowled = Math.floor(totalLegalBalls / 6) + (remOvers / 10);

    await supabase.from('innings').update({
       total_runs: totalRuns,
       total_wickets: totalWickets,
       overs_bowled: oversBowled
    }).eq('id', inningsId);

    // 5. Fetch updated stats for the reverted players
    const strikerStats = await fetchBatterStats(inningsId, lastBall.striker_id);
    const nonStrikerStats = await fetchBatterStats(inningsId, lastBall.non_striker_id);
    const bowlerStats = await fetchBowlerStats(inningsId, lastBall.bowler_id);

    // 6. Restore Match Statistics (revert strike and bowler)
    await supabase.from('matches').update({
       current_version: match.current_version + 1,
       match_statistics: {
          current_striker: lastBall.striker_id,
          current_non_striker: lastBall.non_striker_id,
          current_bowler: lastBall.bowler_id,
          striker_stats: strikerStats,
          non_striker_stats: nonStrikerStats,
          bowler_stats: bowlerStats,
          last_update: new Date().toISOString()
       }
    }).eq('id', matchId);

    revalidatePath(`/matches/${matchId}/dashboard`);
    return { success: true, message: 'Last ball undone successfully.' };

  } catch (error: any) {
    console.error('undoLastBall error:', error);
    return { success: false, message: 'Failed to undo last ball.' };
  }
}

export type MatchLifecycleState = 'scheduled' | 'live' | 'innings_break' | 'completed' | 'verified' | 'locked';

export async function updateMatchLifecycle(matchId: string, newState: MatchLifecycleState) {
  try {
    const supabase = await createClient();
    
    // 1. Fetch current match to verify it exists
    const { data: match } = await supabase.from('matches').select('status').eq('id', matchId).single();
    if (!match) return { success: false, message: 'Match not found' };

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;
    
    // Note: Role verification would go here (e.g., querying user role).
    // Scorer -> completed | Umpire -> verified | Admin -> locked

    const { error } = await supabase
      .from('matches')
      .update({ status: newState })
      .eq('id', matchId);
      
    if (error) throw error;
    
    // 2. Audit Log the lifecycle change
    await supabase.from('scoring_audit_log').insert([{
      correlation_id: crypto.randomUUID(),
      match_id: matchId,
      action_type: `LIFECYCLE_${newState.toUpperCase()}`,
      performed_by: userId,
      reason: `Match lifecycle transitioned to ${newState}`
    }]);

    revalidatePath(`/matches/${matchId}/dashboard`);
    return { success: true, message: `Match successfully updated to ${newState}` };

  } catch (error: any) {
    console.error('updateMatchLifecycle error:', error);
    return { success: false, message: 'Failed to update match lifecycle.' };
  }
}
