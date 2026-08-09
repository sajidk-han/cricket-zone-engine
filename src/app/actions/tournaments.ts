"use server"

import { createClient } from '@/lib/supabase-server'
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
    const supabase = await createClient()
    const { error } = await supabase
      .from('tournaments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', tournamentId)

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
        team:teams (
          id,
          name,
          short_name,
          logo_url
        )
      `)
      .eq('tournament_id', tournamentId)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, message: "Tournament teams retrieved", data }
  } catch (error: any) {
    return { success: false, message: "Failed to retrieve teams", error }
  }
}
