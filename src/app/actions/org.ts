"use server"

import { createClient } from '@/lib/supabase-server'

export async function getDefaultOrgId() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get public user record
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()
    
  if (!userData) {
    throw new Error('User profile not found')
  }

  // Get first organization membership
  const { data: membership } = await supabase
    .from('organization_members')
    .select('org_id')
    .eq('user_id', userData.id)
    .limit(1)
    .maybeSingle()
    
  if (membership) {
    return membership.org_id
  }

  // Fallback to finding any organization if no membership exists (edge case)
  const { data: fallbackOrg } = await supabase.from('organizations').select('id').limit(1).maybeSingle()
  if (fallbackOrg) return fallbackOrg.id
  
  throw new Error('Failed to find an organization. Please register one.')
}
