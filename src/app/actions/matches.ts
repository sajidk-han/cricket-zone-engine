"use server"

import { createClient } from '@/lib/supabase-server'
import { getDefaultOrgId } from '@/app/actions/org'
import { ScheduleMatchSchema, ScheduleMatchInput } from '@/features/matches/schemas'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
  success: boolean
  message: string
  data?: T
  code?: string
  errors?: any
}

export async function scheduleMatch(input: ScheduleMatchInput): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    // 1. Zod Validation
    const validatedData = ScheduleMatchSchema.parse(input)

    const supabase = await createClient()

    // 2. Validate Tournament State
    const { data: tournament } = await supabase
      .from('tournaments')
      .select('status')
      .eq('id', validatedData.tournament_id)
      .single()

    if (!tournament) return { success: false, message: "Tournament not found" }
    if (tournament.status === 'archived') {
      return { success: false, message: "Cannot schedule matches in an archived tournament", code: "INVALID_STATE" }
    }

    // 3. Validate Teams are enrolled
    const { data: enrollments, error: enrollError } = await supabase
      .from('tournament_teams')
      .select('team_id')
      .eq('tournament_id', validatedData.tournament_id)
      .in('team_id', [validatedData.team1_id, validatedData.team2_id])

    if (enrollError || !enrollments || enrollments.length < 2) {
      return { success: false, message: "One or both teams are not enrolled in this tournament", code: "NOT_ENROLLED" }
    }

    // 4. Duplicate fixture check (same teams, same tournament, same scheduled day - optional, but let's check for exact duplicate in 'scheduled' state)
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('tournament_id', validatedData.tournament_id)
      .eq('status', 'scheduled')
      .in('team1_id', [validatedData.team1_id, validatedData.team2_id])
      .in('team2_id', [validatedData.team1_id, validatedData.team2_id])
      .single()

    if (existingMatch) {
      // NOTE: For double round-robin, we might need multiple fixtures. But for MVP Day 2, we can warn or reject.
      // Let's just reject if there's already a *scheduled* (unplayed) match between them.
      return { success: false, message: "A scheduled fixture already exists between these teams", code: "DUPLICATE_FIXTURE" }
    }

    // 5. Generate Match Number (Sequential)
    const { count } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', validatedData.tournament_id)

    const matchNumber = (count || 0) + 1

    // 6. Insert Match
    const slug = `${tournament.status}-${matchNumber}-${validatedData.team1_id.slice(0,4)}-vs-${validatedData.team2_id.slice(0,4)}`

    const matchPayload = {
      org_id: orgId,
      tournament_id: validatedData.tournament_id,
      team1_id: validatedData.team1_id,
      team2_id: validatedData.team2_id,
      ground_id: validatedData.ground_id || null,
      scheduled_time: validatedData.scheduled_at,
      status: 'scheduled',
      match_type: validatedData.match_type,
      scheduled_overs: validatedData.scheduled_overs,
      powerplay_overs: validatedData.settings.powerplayOvers,
      match_number: matchNumber,
      match_stage: 'Group',
      slug: slug,
      settings: validatedData.settings
    }

    const { data: newMatch, error: matchError } = await supabase
      .from('matches')
      .insert([matchPayload])
      .select()
      .single()

    if (matchError) {
      console.error("Match Insert Error", matchError)
      return { success: false, message: "Failed to schedule match" }
    }

    // 7. Activity Timeline Hook
    // In future, insert into activity_timeline
    
    revalidatePath(`/tournaments/${validatedData.tournament_id}`)
    revalidatePath(`/tournaments/${validatedData.tournament_id}/matches`)
    
    return { success: true, message: "Match scheduled successfully", data: newMatch }

  } catch (error: any) {
    console.error("Schedule match error", error)
    if (error.name === 'ZodError') {
      return { success: false, message: "Validation failed", errors: error.errors }
    }
    return { success: false, message: error.message || "An unexpected error occurred" }
  }
}

export async function fetchTournamentMatches(tournamentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      team1:teams!team1_id(id, name, short_name, logo_url),
      team2:teams!team2_id(id, name, short_name, logo_url),
      ground:grounds(id, name)
    `)
    .eq('tournament_id', tournamentId)
    .order('scheduled_time', { ascending: true })

  if (error) {
    console.error("Fetch matches error", error)
    return { success: false, message: "Failed to fetch matches", data: [] }
  }

  return { success: true, data: data || [] }
}

export async function getMatchSummary(matchId: string) {
  const supabase = await createClient()
  
  // Rule 12: getMatchSummary returns only essential data, never ball-by-ball.
  if (!matchId || matchId === 'undefined') {
    return { success: false, message: "Invalid Match ID" }
  }

  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, status, scheduled_time, match_type, scheduled_overs, 
      team1_id, team2_id, toss_winner_id, toss_decision, current_innings, current_version, match_statistics, live_stream_url,
      team1:teams!team1_id(id, name, short_name, logo_url),
      team2:teams!team2_id(id, name, short_name, logo_url),
      ground:grounds(id, name),
      tournament:tournaments(id, name)
    `)
    .eq('id', matchId)
    .limit(1)
    .single()

  if (error) {
    console.error("Fetch match summary error", error.message)
    return { success: false, message: "Match not found" }
  }

  // Cast data as any to bypass Supabase's strict/incorrect type inference for foreign key relationships
  return { success: true, data: data as any }
}

export async function proceedToToss(matchId: string) {
  try {
    const supabase = await createClient()
    
    // Check if match is in 'scheduled' state
    const { data: match } = await supabase.from('matches').select('status, tournament_id').eq('id', matchId).single()
    if (!match) return { success: false, message: "Match not found" }
    if (match.status !== 'scheduled') {
      return { success: false, message: "Match must be in scheduled state to proceed to toss" }
    }

    const { error } = await supabase
      .from('matches')
      .update({ status: 'toss' })
      .eq('id', matchId)

    if (error) throw error

    revalidatePath(`/matches/${matchId}/dashboard`)
    return { success: true, message: "Match moved to Toss phase" }
  } catch (error: any) {
    console.error("proceedToToss error", error)
    return { success: false, message: "Failed to proceed to toss" }
  }
}

export async function saveTossDecision(matchId: string, tossWinnerId: string, tossDecision: 'bat' | 'bowl') {
  try {
    const supabase = await createClient()
    
    const { data: match } = await supabase.from('matches').select('status, team1_id, team2_id').eq('id', matchId).single()
    if (!match) return { success: false, message: "Match not found" }
    if (match.status !== 'toss') {
      return { success: false, message: "Match is not in Toss phase" }
    }

    // Verify winner is part of the match
    if (tossWinnerId !== match.team1_id && tossWinnerId !== match.team2_id) {
      return { success: false, message: "Invalid toss winner" }
    }

    const { error } = await supabase
      .from('matches')
      .update({ 
        toss_winner_id: tossWinnerId,
        toss_decision: tossDecision,
        status: 'playing_xi' 
      })
      .eq('id', matchId)

    if (error) throw error

    revalidatePath(`/matches/${matchId}/dashboard`)
    return { success: true, message: "Toss recorded, proceed to Playing XI" }
  } catch (error: any) {
    console.error("saveTossDecision error", error)
    return { success: false, message: "Failed to save toss decision" }
  }
}

export type PlayingXIPlayer = {
  player_id: string
  batting_position: number
  is_captain: boolean
  is_wicket_keeper: boolean
}

export async function savePlayingXI(matchId: string, team1Id: string, team1Xi: PlayingXIPlayer[], team2Id: string, team2Xi: PlayingXIPlayer[]) {
  try {
    const supabase = await createClient()
    
    // Verify match state
    const { data: match } = await supabase.from('matches').select('status').eq('id', matchId).single()
    if (!match) return { success: false, message: "Match not found" }
    if (match.status !== 'playing_xi') {
      return { success: false, message: "Match is not in Playing XI phase" }
    }

    // Prepare inserts
    const xiInserts = [
      ...team1Xi.map(p => ({
        match_id: matchId,
        team_id: team1Id,
        player_id: p.player_id,
        batting_position: p.batting_position,
        is_captain: p.is_captain,
        is_wicket_keeper: p.is_wicket_keeper
      })),
      ...team2Xi.map(p => ({
        match_id: matchId,
        team_id: team2Id,
        player_id: p.player_id,
        batting_position: p.batting_position,
        is_captain: p.is_captain,
        is_wicket_keeper: p.is_wicket_keeper
      }))
    ]

    const { error: insertError } = await supabase
      .from('match_playing_xi')
      .insert(xiInserts)

    if (insertError) throw insertError

    // Move to Live state
    const { error: updateError } = await supabase
      .from('matches')
      .update({ status: 'live' })
      .eq('id', matchId)

    if (updateError) throw updateError

    revalidatePath(`/matches/${matchId}/dashboard`)
    return { success: true, message: "Playing XI locked. Match is now LIVE!" }

  } catch (error: any) {
    console.error("savePlayingXI error", error)
    return { success: false, message: "Failed to save Playing XI" }
  }
}

export async function updateLiveStreamUrl(matchId: string, url: string | null): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    
    // Server-Side Validation & Normalization
    let finalUrl: string | null = null
    
    if (url) {
      const { parseLiveStreamUrl } = await import('@/features/match-engine/utils/liveStreamParser')
      const parsed = parseLiveStreamUrl(url)
      
      if (!parsed) {
        return { success: false, message: "Unsupported streaming URL. Please provide a valid YouTube or Facebook Live URL.", code: "INVALID_URL" }
      }
      
      finalUrl = parsed.originalUrl
    }

    // Relying on RLS: Only authorized users can update the match. 
    const { data: match, error: fetchError } = await supabase
      .from('matches')
      .select('org_id')
      .eq('id', matchId)
      .single()
      
    if (fetchError || !match) {
      return { success: false, message: "Match not found or unauthorized", code: "NOT_FOUND" }
    }

    // Update Live Stream URL
    const { error: updateError } = await supabase
      .from('matches')
      .update({ live_stream_url: finalUrl })
      .eq('id', matchId)
      
    if (updateError) {
      console.error("Supabase update error:", updateError)
      return { success: false, message: "Failed to update Live Stream URL" }
    }
    
    // Log Audit Event to Activity Timeline
    const { data: userData } = await supabase.auth.getUser()
    
    await supabase.from('activity_timeline').insert({
      org_id: match.org_id,
      entity_type: 'match',
      entity_id: matchId,
      action: 'LiveStreamUpdated',
      description: finalUrl ? `Live stream URL was configured` : `Live stream URL was removed`,
      metadata: { url: finalUrl },
      created_by: userData?.user?.id || null
    })

    revalidatePath(`/matches/${matchId}/overview`)
    revalidatePath(`/matches/${matchId}/settings`)

    return { success: true, message: "Live Stream URL updated successfully" }
    
  } catch (error) {
    console.error('updateLiveStreamUrl error:', error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

