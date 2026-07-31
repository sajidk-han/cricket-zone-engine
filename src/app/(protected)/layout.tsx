import React from 'react'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { GlobalHeader } from '@/shared/components/layout/GlobalHeader'
import { CommandPalette } from '@/shared/components/layout/CommandPalette'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <GlobalHeader />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
