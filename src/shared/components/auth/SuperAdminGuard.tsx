import React from 'react'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

interface SuperAdminGuardProps {
  children: React.ReactNode
}

/**
 * Server Component that secures routes for Super Admins only.
 */
export async function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Find the internal user ID and check super admin status
  const { data: internalUser } = await supabase
    .from('users')
    .select('is_super_admin')
    .eq('auth_id', user.id)
    .single()

  if (!internalUser || !internalUser.is_super_admin) {
    // If they are not a super admin, send them to their regular dashboard
    redirect('/dashboard')
  }

  return <>{children}</>
}
