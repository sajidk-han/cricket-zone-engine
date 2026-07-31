import React from 'react'
import { createClient } from '@/lib/supabase-server'

interface RoleGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  allowedRoles: ('owner' | 'admin' | 'manager' | 'scorer' | 'viewer')[]
  orgId?: string
}

/**
 * Server Component that conditionally renders its children based on the user's role in the organization.
 * Satisfies the Enterprise Permission UI requirement.
 */
export async function RoleGuard({ 
  children, 
  fallback = null, 
  allowedRoles, 
  orgId 
}: RoleGuardProps) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <>{fallback}</>
  }

  // Find the internal user ID mapping
  const { data: internalUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!internalUser) {
    return <>{fallback}</>
  }

  // Build the query to check role
  let query = supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', internalUser.id)

  // If a specific org is provided, check against it, otherwise check any org membership
  if (orgId) {
    query = query.eq('org_id', orgId)
  }

  const { data: memberData } = await query.limit(1).single()

  if (!memberData) {
    return <>{fallback}</>
  }

  const hasAccess = allowedRoles.includes(memberData.role as any)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
