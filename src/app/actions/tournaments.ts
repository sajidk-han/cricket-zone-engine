"use server"

import { createClient, createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { getDefaultOrgId } from '@/app/actions/org'
import { createTournamentSchema, CreateTournamentInput } from '@/features/tournaments/schemas'

export type ActionResponse<T = any> = {
  success: boolean
  message: string
  data?: T
  error?: any
  code?: string
}

export async function createTournament(input: CreateTournamentInput): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found", code: "NO_ORG" }

    // Rule 5: Validate via Zod
    const validated = createTournamentSchema.parse(input)

    const supabase = await createClient()

    // Rule 8: Duplicate tournament names inside the same org
    const { data: existing } = await supabase
      .from('tournaments')
      .select('id')
      .eq('org_id', orgId)
      .eq('name', validated.name)
      .is('deleted_at', null)
      .single()

    if (existing) {
      return { success: false, message: "A tournament with this name already exists", code: "DUPLICATE_NAME" }
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert([{
        org_id: orgId,
        name: validated.name,
        start_date: validated.start_date,
        end_date: validated.end_date,
        status: 'draft',
        settings: validated.settings || {}
      }])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/tournaments')
    return { success: true, message: "Tournament created successfully", data }
  } catch (error: any) {
    console.error('Create tournament error:', error)
    return { success: false, message: error.message || "Failed to create tournament", error }
  }
}

export async function getTournaments(): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found", code: "NO_ORG" }

    const supabase = await createClient()

    // Rule 7: Soft delete enforced
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, message: "Tournaments retrieved", data }
  } catch (error: any) {
    return { success: false, message: "Failed to retrieve tournaments", error }
  }
}

export async function getTournamentById(id: string): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    if (!data) return { success: false, message: "Tournament not found", code: "NOT_FOUND" }

    return { success: true, message: "Tournament retrieved", data }
  } catch (error: any) {
    return { success: false, message: "Failed to retrieve tournament", error }
  }
}

export async function enrollTeam(tournamentId: string, teamId: string): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()

    // Rule 1: Status Workflow
    const { data: tournament } = await supabase
      .from('tournaments')
      .select('status')
      .eq('id', tournamentId)
      .single()

    if (!tournament) return { success: false, message: "Tournament not found" }
    
    // Only allow if Draft or Registration Open
    if (!['draft', 'registration_open'].includes(tournament.status)) {
      return { success: false, message: "Registration is not open for this tournament", code: "INVALID_STATE" }
    }

    // Rule 8: Duplicate prevention
    const { data: existing } = await supabase
      .from('tournament_teams')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('team_id', teamId)
      .single()

    if (existing) {
      return { success: false, message: "Team is already enrolled", code: "DUPLICATE" }
    }

    const { data, error } = await supabase
      .from('tournament_teams')
      .insert([{
        org_id: orgId,
        tournament_id: tournamentId,
        team_id: teamId
      }])
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/tournaments/${tournamentId}/teams`)
    return { success: true, message: "Team enrolled successfully", data }
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to enroll team", error }
  }
}

export async function deleteTournament(tournamentId: string) {
  try {
    const orgId = await getDefaultOrgId()
    const supabaseAdmin = await createAdminClient()
    const { error } = await supabaseAdmin
      .from('tournaments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', tournamentId)
      .eq('org_id', orgId)

    if (error) throw error

    revalidatePath('/tournaments')
    return { success: true, message: "Tournament deleted successfully!" }
  } catch (error: any) {
    console.error("Delete tournament error", error)
    return { success: false, message: "Failed to delete tournament" }
  }
}

export async function getTournamentTeams(tournamentId: string): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tournament_teams')
      .select(`
        id,
        created_at,
        team:teams!inner (
          id,
          name,
          short_name,
          logo_url
        )
      `)
      .eq('tournament_id', tournamentId)
      .eq('org_id', orgId)
      .is('team.deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, message: "Tournament teams retrieved", data }
  } catch (error: any) {
    return { success: false, message: "Failed to retrieve teams", error }
  }
}

// Standings Actions

export async function getTournamentStandings(tournamentId: string): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()

    // Query from cache projection
    const { data, error } = await supabase
      .from('tournament_standings_cache')
      .select(`
        *,
        team:teams!inner (
          id, name, short_name, logo_url
        )
      `)
      .eq('tournament_id', tournamentId)
      .is('team.deleted_at', null)
      .order('position', { ascending: true })

    if (error) {
      console.warn('Standings fetch warning (migration might be pending):', error.message || error)
      return { success: true, message: 'Standings not available yet', data: [] }
    }

    return { success: true, message: 'Standings retrieved', data }
  } catch (error: any) {
    console.error('getTournamentStandings error:', error)
    return { success: false, message: "Failed to retrieve standings", error }
  }
}

import { calculateStandings } from '@/lib/standings-engine'

export async function recalculateTournamentStandings(tournamentId: string): Promise<ActionResponse> {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const supabase = await createClient()
    const adminSupabase = await createAdminClient()

    // 1. Fetch settings
    const { data: tourney } = await supabase
      .from('tournaments')
      .select('settings')
      .eq('id', tournamentId)
      .single()
      
    // 2. Fetch Teams
    const { data: tTeams } = await supabase
      .from('tournament_teams')
      .select('team:teams!inner(id, name, logo_url)')
      .eq('tournament_id', tournamentId)

    if (!tTeams) return { success: true, message: 'No teams found', data: [] }
    const teams = tTeams.map((tt: any) => ({
      id: tt.team.id,
      name: tt.team.name,
      logo_url: tt.team.logo_url
    }))

    // 3. Fetch Matches
    const { data: matches } = await supabase
      .from('matches')
      .select('id, team1_id, team2_id, status, winning_team_id, result_type')
      .eq('tournament_id', tournamentId)
      .is('deleted_at', null)

    // 4. Calculate
    const standings = calculateStandings(teams, matches || [], tourney?.settings?.scoring_rules || {})

    // 5. Upsert into Cache Table using admin client to bypass RLS constraints if needed, or normal client
    const cacheInserts = standings.map(s => ({
      tournament_id: tournamentId,
      team_id: s.team_id,
      played: s.played,
      won: s.won,
      lost: s.lost,
      tied: s.tied,
      no_result: s.no_result,
      points: s.points,
      runs_for: s.runs_for,
      overs_for: s.overs_for,
      runs_against: s.runs_against,
      overs_against: s.overs_against,
      nrr: s.nrr,
      position: s.position,
      stage: 'League',
      last_calculated_at: new Date().toISOString()
    }))

    // Clear old cache for this tournament/stage
    await adminSupabase
      .from('tournament_standings_cache')
      .delete()
      .eq('tournament_id', tournamentId)
      .eq('stage', 'League')

    if (cacheInserts.length > 0) {
      await adminSupabase
        .from('tournament_standings_cache')
        .insert(cacheInserts)
    }

    revalidatePath(`/tournaments/${tournamentId}/standings`)
    return { success: true, message: "Standings recalculated successfully", data: standings }
  } catch (error: any) {
    console.error('recalculate error:', error)
    return { success: false, message: "Failed to recalculate standings", error }
  }
}
