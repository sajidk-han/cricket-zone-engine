"use client"

import React from 'react'
import { Search, ArrowRight } from 'lucide-react'

export function FanZoneSearchClient() {
  return (
    <div className="w-full max-w-2xl relative mb-16">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="text-text-muted" size={24} />
      </div>
      <input
        type="text"
        placeholder="Enter Organization Name or Slug (e.g., peshawar-club)"
        className="w-full bg-[#111c44] border border-[#1b2559] text-white rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-xl"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const val = e.currentTarget.value.trim().toLowerCase().replace(/\s+/g, '-');
            if (val) window.location.href = `/fanzone/${val}`;
          }
        }}
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button 
          className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-primary/80 transition-colors"
          onClick={(e) => {
            const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
            const val = input?.value.trim().toLowerCase().replace(/\s+/g, '-');
            if (val) window.location.href = `/fanzone/${val}`;
          }}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
