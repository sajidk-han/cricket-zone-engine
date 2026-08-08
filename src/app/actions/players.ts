"use server"

import { createClient } from '@/lib/supabase-server'
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

    if (!fullName) return { success: false, message: "Full Name is required" }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('players')
      .insert([{
        org_id: orgId,
        full_name: fullName,
        primary_role: role,
        batting_style: battingStyle !== 'none' ? battingStyle : null,
        bowling_style: bowlingStyle !== 'none' ? bowlingStyle : null
      }])

    if (error) throw error

    revalidatePath('/players')
    return { success: true, message: "Player registered successfully!" }
  } catch (error: any) {
    console.error("Create player error", error)
    return { success: false, message: "Failed to register player" }
  }
}

export async function deletePlayer(playerId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('players')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', playerId)

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

    if (!fullName) return { success: false, message: "Full Name is required" }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from('players')
      .update({
        full_name: fullName,
        primary_role: role,
        batting_style: battingStyle !== 'none' ? battingStyle : null,
        bowling_style: bowlingStyle !== 'none' ? bowlingStyle : null
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
