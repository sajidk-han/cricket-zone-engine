'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, Trophy, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

export function GlobalSearchOverlay({ orgSlug }: { orgSlug: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleCustomOpen = () => setIsOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-search', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-search', handleCustomOpen)
    }
  }, [])

  if (!isOpen) return null

  // Mock results for now
  const mockResults = query.length > 1 ? [
    { type: 'player', label: `Player matching "${query}"`, href: `/fanzone/${orgSlug}/players/1`, icon: <Users size={16} /> },
    { type: 'team', label: `Team matching "${query}"`, href: `/fanzone/${orgSlug}/teams/1`, icon: <Trophy size={16} /> },
    { type: 'match', label: `Match matching "${query}"`, href: `/fanzone/${orgSlug}/matches/1`, icon: <Calendar size={16} /> },
  ] : []

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-bg-surface border border-bg-elevated rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center px-4 border-b border-bg-elevated">
          <Search size={20} className="text-text-muted" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search teams, players, matches... (Ctrl+K)"
            className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:outline-none focus:ring-0 placeholder:text-text-muted text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white p-2 rounded-lg hover:bg-bg-elevated transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              <div className="mb-4 flex justify-center">
                <div className="flex items-center gap-2 bg-bg-elevated px-3 py-1 rounded text-xs">
                  <kbd className="font-mono bg-bg-surface px-1.5 py-0.5 rounded border border-white/10">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="font-mono bg-bg-surface px-1.5 py-0.5 rounded border border-white/10">K</kbd>
                </div>
              </div>
              <p>Type to start searching across the FanZone...</p>
            </div>
          ) : mockResults.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-brand-primary uppercase tracking-widest">
                Search Results
              </div>
              {mockResults.map((res, i) => (
                <Link 
                  key={i}
                  href={res.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand-primary/10 transition-colors text-white group"
                >
                  <span className="text-text-muted group-hover:text-brand-primary transition-colors">{res.icon}</span>
                  {res.label}
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-text-muted">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
