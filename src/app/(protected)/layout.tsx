import React from 'react'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { GlobalHeader } from '@/shared/components/layout/GlobalHeader'
import { CommandPalette } from '@/shared/components/layout/CommandPalette'
import { MobileNav } from '@/shared/components/layout/MobileNav'
import { createClient } from '@/lib/supabase-server'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userEmail = user?.email || ''
  let userFullName = ''

  if (user) {
    try {
      const { getAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = getAdminClient()
      const { data: dbUser } = await adminClient.from('users').select('full_name').eq('auth_id', user.id).single()
      if (dbUser) {
        userFullName = dbUser.full_name || ''
      }
    } catch(e) {}
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <GlobalHeader userEmail={userEmail} userFullName={userFullName} />
        <main className="flex-1 overflow-x-hidden p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
      <CommandPalette />
      <MobileNav />
    </div>
  )
}
