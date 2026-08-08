import React from 'react'
import Link from 'next/link'
import { Search, Bell, Sun, User, Menu, Home, PlayCircle, Calendar, Trophy, BarChart3, Users } from 'lucide-react'
import { GlobalSearchOverlay } from '@/features/fanzone/components/GlobalSearchOverlay'
import { TopNavActions } from '@/features/fanzone/components/TopNavActions'
import { LogoIcon } from '@/shared/components/LogoIcon'

export const metadata = {
  title: 'Fan Zone | CricketZone',
  description: 'Live cricket scores, match updates, and stats for your local team tournaments.',
  themeColor: '#09090b',
}

export default async function FanZoneLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const basePath = `/fanzone/${orgSlug}`

  return (
    <div className="min-h-screen bg-bg-base text-text-primary pb-20 md:pb-0 font-sans selection:bg-brand-primary/30 flex flex-col relative">
      
      {/* Top Navigation (Desktop & Mobile Header) */}
      <header className="sticky top-0 z-[var(--z-navbar)] bg-bg-surface/90 backdrop-blur-md border-b border-border-dim h-16 flex items-center justify-between px-4 md:px-8">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button className="md:hidden text-text-secondary hover:text-text-primary transition-colors">
            <Menu size={24} />
          </button>
          <Link href={basePath} className="flex items-center gap-3 group">
            <LogoIcon size={32} className="transition-transform group-hover:scale-110" />
            <span className="font-black text-text-primary tracking-tight hidden sm:block">Fan Zone</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavLink href={basePath} label="Home" />
          <NavLink href={`${basePath}/live`} label="Live" />
          <NavLink href={`${basePath}/matches`} label="Matches" />
          <NavLink href={`${basePath}/organizations`} label="Teams" />
        </nav>

        {/* Right: Actions */}
        <TopNavActions />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {children}
      </main>

      <GlobalSearchOverlay orgSlug={orgSlug} />

      {/* Mobile Bottom Navigation Bar (App-like feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[var(--z-navbar)] bg-bg-surface/95 backdrop-blur-md border-t border-border-dim h-16 flex items-center justify-around pb-safe">
        <MobileNavItem href={basePath} icon={<Home size={20} />} label="Home" />
        <MobileNavItem href={`${basePath}/live`} icon={<PlayCircle size={20} />} label="Live" />
        <MobileNavItem href={`${basePath}/matches`} icon={<Calendar size={20} />} label="Matches" />
        <MobileNavItem href={`${basePath}/organizations`} icon={<Trophy size={20} />} label="Teams" />
      </nav>

    </div>
  )
}

function NavLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors relative group">
      {label}
      <span className="absolute -bottom-5 left-1/2 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100 rounded-t-full"></span>
    </Link>
  )
}

function MobileNavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full h-full text-text-secondary hover:text-brand-primary active:scale-95 transition-all gap-1">
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  )
}
