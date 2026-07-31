"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Trophy, LayoutDashboard, Shield, User, PlayCircle, Settings, ArrowLeft, Activity, List, Users } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  
  // Detect if we are inside a specific tournament workspace
  const tournamentMatch = pathname.match(/^\/tournaments\/([a-zA-Z0-9-]+)(?:\/(.*))?$/)
  const isTournamentWorkspace = !!tournamentMatch && tournamentMatch[1] !== 'new'
  const tournamentId = isTournamentWorkspace ? tournamentMatch[1] : null

  // ==========================================
  // GLOBAL NAVIGATION
  // ==========================================
  const globalNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tournaments', href: '/tournaments', icon: <Trophy size={20} /> },
    { name: 'Teams', href: '/teams', icon: <Shield size={20} /> },
    { name: 'Players', href: '/players', icon: <User size={20} /> },
    { name: 'Match Center', href: '/matches', icon: <PlayCircle size={20} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ]

  // ==========================================
  // TOURNAMENT WORKSPACE NAVIGATION
  // ==========================================
  const tournamentNavItems = [
    { name: 'Overview', href: `/tournaments/${tournamentId}`, icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Matches', href: `/tournaments/${tournamentId}/matches`, icon: <PlayCircle size={20} /> },
    { name: 'Teams', href: `/tournaments/${tournamentId}/teams`, icon: <Shield size={20} /> },
    { name: 'Standings', href: `/tournaments/${tournamentId}/standings`, icon: <List size={20} /> },
    { name: 'Activity Feed', href: `/tournaments/${tournamentId}/activity`, icon: <Activity size={20} /> },
    { name: 'Settings', href: `/tournaments/${tournamentId}/settings`, icon: <Settings size={20} /> },
  ]

  const navItems = isTournamentWorkspace ? tournamentNavItems : globalNavItems

  return (
    <aside className="hidden md:flex w-64 bg-bg-surface border-r border-bg-elevated h-screen flex-col fixed left-0 top-0 z-50">
      
      {/* Header Area */}
      <div className="p-6 border-b border-bg-elevated h-16 flex items-center">
        {!isTournamentWorkspace ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🏏</span>
            <span className="text-xl font-black text-brand-primary tracking-tighter">CricketZone</span>
          </Link>
        ) : (
          <Link href="/tournaments" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold uppercase tracking-wider">Back to Global</span>
          </Link>
        )}
      </div>

      {/* Workspace Context Info (Only in Tournament Mode) */}
      {isTournamentWorkspace && (
        <div className="px-6 py-4 border-b border-bg-elevated bg-brand-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-sm">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-bold">Workspace</p>
              <p className="text-sm font-bold text-text-primary truncate w-36">Tournament View</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scroll-smooth">
        {navItems.map((item) => {
          const isActive = 'exact' in item && item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href)
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm group
                ${isActive 
                  ? 'bg-brand-primary/10 text-brand-primary shadow-sm' 
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                }
              `}
            >
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer Branding (Global Only) */}
      {!isTournamentWorkspace && (
        <div className="p-4 border-t border-bg-elevated flex items-center justify-center">
           <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Enterprise Edition</p>
        </div>
      )}
    </aside>
  )
}
