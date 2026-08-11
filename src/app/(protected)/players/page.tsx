import React from 'react'
import { fetchOrganizationPlayers } from '@/app/actions/players'
import { PlayersDirectoryClient } from './client'
import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getDefaultOrgId } from '@/app/actions/org'

export default async function PlayersDirectoryPage() {
  const players = await fetchOrganizationPlayers()
  
  // Get user context for permissions
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole = 'viewer'
  let internalUserId = null
  
  if (user) {
    try {
      const adminClient = getAdminClient()
      const { data: dbUser } = await adminClient.from('users').select('id').eq('auth_id', user.id).single()
      if (dbUser) {
        internalUserId = dbUser.id
        const orgId = await getDefaultOrgId()
        const { data: member } = await adminClient.from('organization_members').select('role').eq('user_id', dbUser.id).eq('org_id', orgId).single()
        if (member) userRole = member.role
      }
    } catch(e) {}
  }

  return (
    <PlayersDirectoryClient 
      initialPlayers={players || []} 
      currentUserRole={userRole}
      currentUserId={internalUserId}
    />
  )
}
