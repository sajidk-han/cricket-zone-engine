import React from 'react'
import Link from 'next/link'
import { getTournamentById } from '@/app/actions/tournaments'
import { LayoutDashboard, Users, CalendarDays, Settings, ListOrdered, ChevronRight } from 'lucide-react'

export default async function TournamentWorkspaceLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const res = await getTournamentById(resolvedParams.id)
  
  if (!res.success || !res.data) {
    return (
      <div className="p-12 text-center text-red-500">
        <h2 className="text-2xl font-black mb-2">Tournament Not Found</h2>
        <p>{res.message}</p>
        <Link href="/tournaments" className="text-brand-primary mt-4 inline-block hover:underline">
          Return to Tournaments
        </Link>
      </div>
    )
  }

  const tournament = res.data

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb Navigation (Rule 10) */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <Link href="/tournaments" className="hover:text-text-primary transition-colors">Tournaments</Link>
        <ChevronRight size={14} />
        <span className="text-text-primary font-medium">{tournament.name}</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Workspace Header */}
        <div>
          <h1 className="text-3xl font-black text-text-primary">{tournament.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full border bg-slate-500/10 text-slate-400 border-slate-500/20 uppercase">
              {tournament.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-text-secondary">{tournament.settings?.match_format?.toUpperCase() || 'T20'} Format</span>
          </div>
        </div>

        {/* Workspace Tabs */}
        <div className="flex border-b border-bg-elevated overflow-x-auto no-scrollbar">
          <WorkspaceTab href={`/tournaments/${tournament.id}/dashboard`} icon={<LayoutDashboard size={16}/>} label="Dashboard" />
          <WorkspaceTab href={`/tournaments/${tournament.id}/teams`} icon={<Users size={16}/>} label="Teams" />
          <WorkspaceTab href={`/tournaments/${tournament.id}/matches`} icon={<CalendarDays size={16}/>} label="Matches" />
          <WorkspaceTab href={`/tournaments/${tournament.id}/standings`} icon={<ListOrdered size={16}/>} label="Standings" />
          <WorkspaceTab href={`/tournaments/${tournament.id}/settings`} icon={<Settings size={16}/>} label="Settings" />
        </div>

        {/* Content Area */}
        <div className="py-2">
          {children}
        </div>
      </div>
    </div>
  )
}

function WorkspaceTab({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  // In a real client component we'd use usePathname to highlight the active tab.
  // For this server layout, we can just rely on the link. The active state can be managed by a separate client component if needed, 
  // but to keep it simple and fast, we'll just style it cleanly.
  return (
    <Link href={href} className="flex items-center gap-2 px-6 py-4 text-sm font-bold text-text-secondary hover:text-text-primary border-b-2 border-transparent hover:border-brand-primary/50 transition-all whitespace-nowrap">
      {icon}
      {label}
    </Link>
  )
}
