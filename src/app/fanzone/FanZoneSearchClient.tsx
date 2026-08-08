"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Search, ArrowRight, Loader2, Trophy } from 'lucide-react'
import { searchOrganizations } from './actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function FanZoneSearchClient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true)
        const orgs = await searchOrganizations(query.trim())
        setResults(orgs)
        setIsOpen(true)
        setIsLoading(false)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      const val = query.trim().toLowerCase().replace(/\s+/g, '-');
      router.push(`/fanzone/${val}`);
    }
  }

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl relative mb-16 z-50">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="text-text-muted" size={24} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true) }}
        placeholder="Search for Tournaments or Organizations (e.g., Shangla...)"
        className="w-full bg-[#111c44] border border-[#1b2559] text-white rounded-full py-4 pl-12 pr-12 text-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-xl"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch()
        }}
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        {isLoading ? (
          <div className="p-2 mr-2">
            <Loader2 className="animate-spin text-brand-primary" size={20} />
          </div>
        ) : (
          <button 
            onClick={handleSearch}
            className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-primary/80 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111c44] border border-[#1b2559] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-wider border-b border-[#1b2559] mb-2">
                Organizations
              </div>
              {results.map((org) => (
                <Link 
                  key={org.id} 
                  href={`/fanzone/${org.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#1b2559]/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#1b2559] rounded-full flex items-center justify-center border border-[#2b3569] group-hover:border-brand-primary/50 overflow-hidden">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy size={16} className="text-brand-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-bold group-hover:text-brand-primary transition-colors">{org.name}</div>
                    <div className="text-xs text-text-muted">/{org.slug}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-text-muted">
              No organizations found for "{query}". Try a different name!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
