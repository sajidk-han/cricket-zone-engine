"use server"

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

import { getDefaultOrgId } from '@/app/actions/org'

export async function createTeam(formData: FormData) {
  const name = formData.get('name') as string
  const shortName = formData.get('shortName') as string
  
  if (!name || !shortName) throw new Error('Name and Short Name are required')

  const orgId = await getDefaultOrgId()
  const supabase = await createClient()

  const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const slug = `${slugBase}-${Math.random().toString(36).substring(2, 8)}`

  const { data, error } = await supabase
    .from('teams')
    .insert([{ 
      org_id: orgId,
      name, 
      short_name: shortName.toUpperCase(),
      slug
    }])
    .select()
    .single()

  if (error) {
    console.error('Create team error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/teams')
  return data
}

export async function updateTeamLogo(teamId: string, logoUrl: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teams')
    .update({ logo_url: logoUrl })
    .eq('id', teamId)
    .select()
    .single()

  if (error) {
    console.error('Update team logo error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/teams')
  revalidatePath(`/teams/${teamId}`)
  return data
}

export async function uploadTeamLogo(formData: FormData) {
  const teamId = formData.get('teamId') as string
  const orgId = formData.get('orgId') as string
  const file = formData.get('file') as File
  
  if (!teamId || !orgId || !file) {
    throw new Error('Missing required fields for logo upload')
  }

  const adminSupabase = createAdminClient()
  const storagePath = `${orgId}/${teamId}/logo.webp`

  // Convert File to ArrayBuffer for server upload
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload using admin client (bypasses RLS)
  const { data: uploadData, error: uploadError } = await adminSupabase
    .storage
    .from('team-logos')
    .upload(storagePath, buffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/webp'
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error(uploadError.message)
  }

  // Get public URL
  const { data: { publicUrl } } = adminSupabase
    .storage
    .from('team-logos')
    .getPublicUrl(storagePath)

  const urlWithBuster = `${publicUrl}?t=${Date.now()}`

  // Update team record
  const supabase = await createClient()
  const { error: updateError } = await supabase
    .from('teams')
    .update({ logo_url: urlWithBuster })
    .eq('id', teamId)

  if (updateError) {
    console.error('Update team logo_url error:', updateError)
    throw new Error(updateError.message)
  }

  revalidatePath('/teams')
  revalidatePath(`/teams/${teamId}`)
  return { success: true, publicUrl: urlWithBuster }
}

export async function fetchTeams() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch teams error:', error)
    return []
  }

  return data
}

export async function fetchTeamById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error) {
    console.error('Fetch team error:', error.message, error.details, error.hint)
    return null
  }

  return data?.[0] || null
}

export async function fetchTeamRoster(teamId: string) {
  const supabase = await createClient()
  
  // We need to fetch players assigned to this team
  const { data, error } = await supabase
    .from('team_players')
    .select(`
      id,
      role,
      jersey_number,
      player:players (
        id,
        full_name,
        primary_role,
        batting_style,
        bowling_style
      )
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fetch roster error:', error)
    return []
  }

  return data.map((tp: any) => ({
    team_player_id: tp.id,
    id: tp.player.id,
    name: tp.player.full_name,
    role: tp.role,
    player_role: tp.player.primary_role,
    jersey: tp.jersey_number,
    battingStyle: tp.player.batting_style,
    bowlingStyle: tp.player.bowling_style
  }))
}

export async function assignPlayerToTeam(formData: FormData) {
  const teamId = formData.get('teamId') as string
  const playerId = formData.get('playerId') as string
  const role = formData.get('role') as string || 'Player'
  const jerseyStr = formData.get('jersey') as string
  const jerseyNumber = jerseyStr ? parseInt(jerseyStr, 10) : null
  
  if (!teamId || !playerId) throw new Error('Team and Player are required')

  const orgId = await getDefaultOrgId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('team_players')
    .insert([{ 
      org_id: orgId,
      team_id: teamId,
      player_id: playerId,
      role,
      jersey_number: jerseyNumber
    }])

  if (error) {
    console.error('Assign player error:', error)
    // Handle unique constraint error specifically if needed
    if (error.code === '23505') {
      throw new Error('This player is already in the team roster.')
    }
    throw new Error(error.message)
  }

  revalidatePath(`/teams/${teamId}`)
  return { success: true }
}

export async function updateTeamPlayer(formData: FormData) {
  const teamPlayerId = formData.get('teamPlayerId') as string
  const teamId = formData.get('teamId') as string
  const role = formData.get('role') as string || 'Player'
  const jerseyStr = formData.get('jersey') as string
  const jerseyNumber = jerseyStr ? parseInt(jerseyStr, 10) : null

  if (!teamPlayerId || !teamId) return { success: false, message: "Missing info" }

  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { error } = await supabase
      .from('team_players')
      .update({ role, jersey_number: jerseyNumber })
      .eq('id', teamPlayerId)

    if (error) throw error

    revalidatePath(`/teams/${teamId}`)
    return { success: true, message: "Player updated successfully!" }
  } catch (error: any) {
    console.error("Update team player error", error)
    return { success: false, message: "Failed to update player" }
  }
}

export async function updateTeam(teamId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const shortName = formData.get('shortName') as string

    if (!name || !shortName) return { success: false, message: "Name and Short Name are required" }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('teams')
      .update({
        name,
        short_name: shortName.toUpperCase(),
      })
      .eq('id', teamId)

    if (error) throw error

    revalidatePath(`/teams/${teamId}`)
    revalidatePath('/teams')
    return { success: true, message: "Team updated successfully!" }
  } catch (error: any) {
    console.error("Update team error", error)
    return { success: false, message: "Failed to update team" }
  }
}

export async function removeTeamPlayer(teamPlayerId: string, teamId: string) {
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('id', teamPlayerId)

    if (error) throw error

    revalidatePath(`/teams/${teamId}`)
    return { success: true, message: "Player removed successfully!" }
  } catch (error: any) {
    console.error("Remove team player error", error)
    return { success: false, message: "Failed to remove player" }
  }
}
