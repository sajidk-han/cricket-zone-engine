"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Bell, Moon, Sun, User, Settings, LogOut, Command } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '../ui/Button'
import { logout } from '@/app/actions/auth'
import { LogoIcon } from '@/shared/components/LogoIcon'

import { CreatePlayerDrawer } from '@/features/players/components/CreatePlayerDrawer'
import { InviteUserDrawer } from '@/features/organizations/components/InviteUserDrawer'

export function GlobalHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [isPlayerDrawerOpen, setIsPlayerDrawerOpen] = useState(false)
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState(false)

  // Ensure hydration matches server
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-surface/80 backdrop-blur-md border-b border-bg-elevated flex items-center justify-between px-4 h-16">
      
      {/* LEFT: Logo & Org Switcher */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoIcon size={32} />
          <span className="text-xl font-black text-green-400 tracking-tighter hidden md:block">CricketZone</span>
        </Link>
        
        <div className="h-6 w-px bg-bg-elevated hidden md:block"></div>

        <button className="hidden md:flex items-center gap-2 text-sm font-medium hover:bg-bg-elevated/50 px-3 py-1.5 rounded-lg transition-colors">
          <div className="w-6 h-6 rounded bg-brand-secondary text-white flex items-center justify-center text-xs font-bold">
            E
          </div>
          <span>Eagles Club</span>
          <span className="text-text-secondary text-xs opacity-50">▼</span>
        </button>
      </div>

      {/* CENTER: Global Search (Command Palette Trigger) */}
      <div className="flex-1 max-w-xl px-4 hidden md:block">
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="w-full bg-bg-base border border-bg-elevated hover:border-text-secondary/50 text-text-secondary text-sm rounded-lg px-4 py-2 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search size={16} className="text-text-secondary group-hover:text-text-primary transition-colors" />
            <span>Search tournaments, teams, players...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-bg-elevated px-1.5 rounded text-[10px] font-medium font-sans border border-bg-elevated/50 shadow-sm text-text-primary">
              <Command size={10} /> K
            </kbd>
          </div>
        </button>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Quick Create (+) */}
        <div className="relative">
          <Button 
            variant="primary" 
            size="sm" 
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
          >
            <Plus size={16} />
          </Button>
          
          {showCreateMenu && (
            <div className="absolute top-10 right-0 w-48 bg-bg-surface border border-bg-elevated rounded-xl shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-2 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Create New</div>
              <Link href="/tournaments/new" onClick={() => setShowCreateMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors">
                <span>🏆</span> Tournament
              </Link>
              <Link href="/teams/new" onClick={() => setShowCreateMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors">
                <span>🛡️</span> Team
              </Link>
              <button 
                onClick={() => { setIsPlayerDrawerOpen(true); setShowCreateMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors"
              >
                <span>🏃</span> Player
              </button>
              <div className="h-px bg-bg-elevated my-1"></div>
              <button 
                onClick={() => { setIsInviteDrawerOpen(true); setShowCreateMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-colors"
              >
                <span>✉️</span> Invite User
              </button>
            </div>
          )}
        </div>

        {/* Global Drawers rendered outside the menu */}
        <CreatePlayerDrawer 
          open={isPlayerDrawerOpen} 
          onOpenChange={setIsPlayerDrawerOpen} 
          trigger={<></>} 
        />
        <InviteUserDrawer 
          open={isInviteDrawerOpen} 
          onOpenChange={setIsInviteDrawerOpen} 
          trigger={<></>} 
        />

        {/* Notifications */}
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full border border-bg-surface"></span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors hidden sm:block"
        >
          {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-6 w-px bg-bg-elevated hidden sm:block"></div>

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent hover:ring-brand-primary/50 transition-all"
          >
            A
          </button>

          {showUserMenu && (
            <div className="absolute top-10 right-0 w-56 bg-bg-surface border border-bg-elevated rounded-xl shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-bg-elevated mb-1">
                <p className="text-sm font-bold text-text-primary">Admin User</p>
                <p className="text-xs text-text-secondary truncate">admin@cricketzone.com</p>
              </div>
              <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated rounded-lg transition-colors">
                <Settings size={16} className="text-text-secondary" /> Settings & Preferences
              </Link>
              <div className="h-px bg-bg-elevated my-1"></div>
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <LogOut size={16} /> Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
        
      </div>
    </header>
  )
}
