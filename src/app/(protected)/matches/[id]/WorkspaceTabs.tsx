'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Activity, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  Clock, 
  Users, 
  Settings, 
  ShieldCheck 
} from 'lucide-react'

export function WorkspaceTabs({ matchId }: { matchId: string }) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const tabs = [
    { href: `/matches/${matchId}/overview`, icon: <LayoutDashboard size={16}/>, label: "Overview" },
    { href: `/matches/${matchId}/scoring`, icon: <Activity size={16}/>, label: "Scoring" },
    { href: `/matches/${matchId}/scorecard`, icon: <FileText size={16}/>, label: "Scorecard" },
    { href: `/matches/${matchId}/commentary`, icon: <MessageSquare size={16}/>, label: "Commentary" },
    { href: `/matches/${matchId}/analytics`, icon: <BarChart2 size={16}/>, label: "Analytics" },
    { href: `/matches/${matchId}/timeline`, icon: <Clock size={16}/>, label: "Timeline" },
    { href: `/matches/${matchId}/officials`, icon: <Users size={16}/>, label: "Officials" },
    { href: `/matches/${matchId}/audit-log`, icon: <ShieldCheck size={16}/>, label: "Audit Log" },
    { href: `/matches/${matchId}/settings`, icon: <Settings size={16}/>, label: "Settings" }
  ]

  useEffect(() => {
    // Find the active tab element
    if (!containerRef.current) return
    const activeElement = containerRef.current.querySelector('[data-active="true"]') as HTMLElement
    
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1
      })
    }
  }, [pathname])

  return (
    <div 
      ref={containerRef} 
      className="flex border-b border-white/5 overflow-x-auto no-scrollbar relative max-w-full"
    >
      {tabs.map(tab => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
        return (
          <Link 
            key={tab.href}
            href={tab.href} 
            data-active={isActive}
            className={`relative flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap z-10 ${
              isActive 
                ? 'text-fuchsia-400' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        )
      })}
      
      {/* Animated Indicator */}
      <motion.div
        className="absolute bottom-0 h-[3px] bg-gradient-to-r from-fuchsia-500 to-blue-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] rounded-full z-20 pointer-events-none"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          opacity: indicatorStyle.opacity
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    </div>
  )
}
