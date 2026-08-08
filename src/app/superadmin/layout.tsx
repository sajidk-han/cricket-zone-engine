import React from 'react'
import { SuperAdminGuard } from '@/shared/components/auth/SuperAdminGuard'
import Link from 'next/link'

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminGuard>
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
        {/* Top Navbar */}
        <nav className="h-16 border-b border-bg-elevated bg-bg-surface/50 backdrop-blur-md sticky top-0 z-40 flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-black text-brand-accent tracking-tighter">Super Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Exit to App
            </Link>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </SuperAdminGuard>
  )
}
