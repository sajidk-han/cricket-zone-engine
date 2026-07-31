"use server"

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

import { getDefaultOrgId } from '@/app/actions/org'

export async function createTeam(formData: FormData) {
  const name = formData.get('name') as string
  const shortName = formData.get('shortName') as string
  
  if (!name || !shortName) throw new Error('Name and Short Name are required')

  const orgId = await getDefaultOrgId()

  const { data, error } = await supabase
    .from('teams')
    .insert([{ 
      org_id: orgId,
      name, 
      short_name: shortName.toUpperCase()
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

export async function fetchTeams() {
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
