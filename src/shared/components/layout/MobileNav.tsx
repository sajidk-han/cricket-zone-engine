"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Trophy, PlayCircle, Settings, Globe } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tournaments', href: '/tournaments', icon: <Trophy size={20} /> },
    { name: 'Match Center', href: '/matches', icon: <PlayCircle size={20} /> },
    { name: 'Fan Zone', href: '/fanzone/default-org', icon: <Globe size={20} /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-bg-elevated z-50 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium leading-none">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
