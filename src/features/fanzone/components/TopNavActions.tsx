'use client'

import React from 'react'
import Link from 'next/link'
import { Search, Bell, Sun, Moon, User, LayoutDashboard } from 'lucide-react'
import { useTheme } from 'next-themes'

export function TopNavActions() {
  const openSearch = () => {
    window.dispatchEvent(new Event('open-search'))
  }

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center gap-3 sm:gap-5 text-text-secondary">
      <Link 
        href="/dashboard"
        className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-lg hover:bg-brand-primary/20 transition-colors mr-2"
      >
        <LayoutDashboard size={16} />
        <span className="text-sm font-bold hidden sm:inline">Admin</span>
      </Link>
      <button 
        onClick={openSearch}
        className="hover:text-white transition-colors flex items-center gap-2" 
        title="Global Search (Ctrl+K)"
      >
        <Search size={20} />
      </button>
      <button className="hover:text-white transition-colors relative" title="Notifications">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </button>
      <button onClick={toggleTheme} className="hidden sm:block hover:text-white transition-colors" title="Theme Toggle">
        {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <button className="hover:text-white transition-colors" title="Profile">
        <User size={20} />
      </button>
    </div>
  )
}
