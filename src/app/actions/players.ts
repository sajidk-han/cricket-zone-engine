"use server"

import { createClient, createAdminClient } from '@/lib/supabase-server'
import { getDefaultOrgId } from '@/app/actions/org'
import { revalidatePath } from 'next/cache'

export async function fetchOrganizationPlayers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch players error:', error)
    return []
  }

  return data
}

export async function createPlayer(formData: FormData) {
  try {
    const orgId = await getDefaultOrgId()
    if (!orgId) return { success: false, message: "Organization not found" }

    const fullName = formData.get('fullName') as string
    const battingStyle = formData.get('battingStyle') as string
    const bowlingStyle = formData.get('bowlingStyle') as string
    const role = formData.get('role') as string
    const leadershipRole = formData.get('leadershipRole') as string

    const avatarUrl = formData.get('avatarUrl') as string || null

    if (!fullName) return { success: false, message: "Full Name is required" }

    const slugBase = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const slug = `${slugBase}-${Math.random().toString(36).substring(2, 8)}`

    const supabase = await createClient()
    
    const { data: newPlayer, error } = await supabase
      .from('players')
      .insert([{
        org_id: orgId,
        full_name: fullName,
        primary_role: role,
        leadership_role: leadershipRole && leadershipRole !== 'none' ? leadershipRole : null,
        batting_style: battingStyle !== 'none' ? battingStyle : null,
        bowling_style: bowlingStyle !== 'none' ? bowlingStyle : null,
        avatar_url: avatarUrl,
        avatar_updated_at: avatarUrl ? new Date().toISOString() : null,
        slug: slug
      }])
      .select('id')
      .single()

    if (error) throw error

    revalidatePath('/players')
    return { success: true, message: "Player registered successfully!", playerId: newPlayer.id, orgId }
  } catch (error: any) {
    console.error("Create player error", error)
    return { success: false, message: "Failed to register player" }
  }
}

export async function deletePlayer(playerId: string) {
  try {
    const orgId = await getDefaultOrgId()
    const supabaseAdmin = await createAdminClient()
    
    // First, get the player's org_id and avatar_url to clean up storage
    const { data: player } = await supabaseAdmin
      .from('players')
      .select('org_id, avatar_url')
      .eq('id', playerId)
      .single()

    if (player?.avatar_url) {
      await removePlayerAvatar(player.org_id, playerId)
    }

    const { error } = await supabaseAdmin
      .from('players')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', playerId)
      .eq('org_id', orgId)

    if (error) throw error

    revalidatePath('/players')
    return { success: true, message: "Player deleted successfully!" }
  } catch (error: any) {
    console.error("Delete player error", error)
    return { success: false, message: "Failed to delete player" }
  }
}

export async function updatePlayer(playerId: string, formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string
    const battingStyle = formData.get('battingStyle') as string
    const bowlingStyle = formData.get('bowlingStyle') as string
    const role = formData.get('role') as string
    const leadershipRole = formData.get('leadershipRole') as string

    if (!fullName) return { success: false, message: "Full Name is required" }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('players')
      .update({
        full_name: fullName,
        primary_role: role,
        leadership_role: leadershipRole && leadershipRole !== 'none' ? leadershipRole : null,
        batting_style: battingStyle !== 'none' ? battingStyle : null,
        bowling_style: bowlingStyle !== 'none' ? bowlingStyle : null,
        avatar_url: formData.get('avatarUrl') as string || null,
        avatar_updated_at: formData.get('avatarUrl') ? new Date().toISOString() : null
      })
      .eq('id', playerId)

    if (error) throw error

    revalidatePath(`/players/${playerId}`)
    revalidatePath('/players')
    return { success: true, message: "Player updated successfully!" }
  } catch (error: any) {
    console.error("Update player error", error)
    return { success: false, message: "Failed to update player" }
  }
}

export async function uploadPlayerAvatar(formData: FormData) {
  const playerId = formData.get('entityId') as string
  const orgId = formData.get('orgId') as string
  const file = formData.get('file') as File
  
  if (!playerId || !orgId || !file) {
    throw new Error('Missing required fields for avatar upload')
  }

  const { createAdminClient } = await import('@/lib/supabase-server')
  const adminSupabase = createAdminClient()
  const storagePath = `${orgId}/${playerId}/avatar.webp`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { data: uploadData, error: uploadError } = await adminSupabase
    .storage
    .from('player-avatars')
    .upload(storagePath, buffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/webp'
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error(uploadError.message)
  }

  const { data: { publicUrl } } = adminSupabase.storage
    .from('player-avatars')
    .getPublicUrl(storagePath)

  return { success: true, publicUrl: `${publicUrl}?t=${new Date().getTime()}` }
}

export async function removePlayerAvatar(orgId: string, playerId: string) {
  try {
    const { createAdminClient } = await import('@/lib/supabase-server')
    const adminSupabase = createAdminClient()
    const storagePath = `${orgId}/${playerId}/avatar.webp`

    const { error } = await adminSupabase.storage.from('player-avatars').remove([storagePath])
    if (error) throw error

    return { success: true }
  } catch (err: any) {
    console.error('Remove avatar error:', err)
    return { success: false, error: err.message }
  }
}
