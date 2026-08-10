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

  // Strict Tenant Isolation: Never fall back to a random organization!
  // If the user has no membership (which shouldn't happen with the new trigger), they must be isolated.
  throw new Error('NO_ORG')
}
