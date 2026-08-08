"use server"

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// Utility to verify super admin status before executing actions
async function verifySuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  const { data: internalUser } = await supabase
    .from('users')
    .select('is_super_admin')
    .eq('auth_id', user.id)
    .single()

  if (!internalUser?.is_super_admin) {
    throw new Error('Forbidden: Super Admin access required')
  }

  return supabase
}

export async function fetchOrganizations() {
  try {
    const supabase = await verifySuperAdmin()
    
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, slug, status, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  } catch (err: any) {
    console.error(err)
    return { error: err.message }
  }
}

export async function updateOrganizationStatus(orgId: string, status: 'approved' | 'pending' | 'suspended') {
  try {
    const supabase = await verifySuperAdmin()
    
    const { error } = await supabase
      .from('organizations')
      .update({ status })
      .eq('id', orgId)

    if (error) throw error
    
    revalidatePath('/superadmin')
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { error: err.message }
  }
}
