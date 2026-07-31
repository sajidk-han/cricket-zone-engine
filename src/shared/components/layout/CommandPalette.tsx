"use client"

import React, { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Search, Trophy, Shield, User as UserIcon, Calendar, Settings } from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="Global Command Palette"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200"
    >
      <div className="bg-bg-surface w-full max-w-2xl rounded-xl border border-bg-elevated shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-200 ease-out scale-100 data-[state=closed]:scale-95">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-3 border-b border-bg-elevated">
          <Search size={20} className="text-text-secondary mr-3" />
          <Command.Input 
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary text-base"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-bg-elevated px-2 py-1 rounded text-xs font-medium font-sans border border-bg-elevated/50 shadow-sm text-text-secondary">
            ESC
          </kbd>
        </div>

        {/* Command List Area */}
        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-smooth">
          <Command.Empty className="py-6 text-center text-text-secondary text-sm">
            No results found.
          </Command.Empty>

          <Command.Group heading="Tournaments" className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-2 py-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tournaments/new'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-bg-elevated text-sm text-text-primary cursor-pointer aria-selected:bg-brand-primary/10 aria-selected:text-brand-primary transition-colors"
            >
              <Trophy size={16} /> Create New Tournament
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/tournaments'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-bg-elevated text-sm text-text-primary cursor-pointer aria-selected:bg-brand-primary/10 aria-selected:text-brand-primary transition-colors"
            >
              <Calendar size={16} /> View All Tournaments
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-bg-elevated my-2" />

          <Command.Group heading="Teams & Players" className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-2 py-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/teams/new'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-bg-elevated text-sm text-text-primary cursor-pointer aria-selected:bg-brand-primary/10 aria-selected:text-brand-primary transition-colors"
            >
              <Shield size={16} /> Register Team
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/players/new'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-bg-elevated text-sm text-text-primary cursor-pointer aria-selected:bg-brand-primary/10 aria-selected:text-brand-primary transition-colors"
            >
              <UserIcon size={16} /> Add New Player
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-bg-elevated my-2" />

          <Command.Group heading="Settings" className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-2 py-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/settings'))}
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-bg-elevated text-sm text-text-primary cursor-pointer aria-selected:bg-brand-primary/10 aria-selected:text-brand-primary transition-colors"
            >
              <Settings size={16} /> Organization Settings
            </Command.Item>
          </Command.Group>

        </Command.List>
      </div>
    </Command.Dialog>
  )
}
