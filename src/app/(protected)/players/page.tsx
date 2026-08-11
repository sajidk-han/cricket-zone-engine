import React from 'react'
import { fetchOrganizationPlayers } from '@/app/actions/players'
import { PlayersDirectoryClient } from './client'
import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase/admin'

export default async function PlayersDirectoryPage() {
  const players = await fetchOrganizationPlayers()
  
  // Get user context for permissions
  const { createClient } = await import('@/lib/supabase-server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let internalUserId = null
  let userMemberships: Record<string, string> = {}
  
  if (user) {
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = getAdminClient()
      const { data: dbUser } = await adminClient.from('users').select('id').eq('auth_id', user.id).single()
      if (dbUser) {
        internalUserId = dbUser.id
        const { data: members } = await adminClient.from('organization_members').select('org_id, role').eq('user_id', dbUser.id)
        if (members) {
          members.forEach((m: any) => {
            userMemberships[m.org_id] = m.role
          })
        }
      }
    } catch(e) {}
  }

  return (
    <PlayersDirectoryClient 
      initialPlayers={players || []} 
      userMemberships={userMemberships}
      currentUserId={internalUserId}
    />
  )
}
