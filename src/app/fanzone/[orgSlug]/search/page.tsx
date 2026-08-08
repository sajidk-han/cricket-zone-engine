import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Search } from 'lucide-react'

export default function SearchPage() {
  return (
    <div className="md:ml-64 p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-text-primary mb-6">Global Search</h1>
      
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-bg-elevated rounded-xl leading-5 bg-bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-brand-primary sm:text-sm"
          placeholder="Search for players, matches, or teams..."
        />
      </div>

      <Card className="border-dashed border-bg-elevated bg-transparent mt-8">
        <CardContent className="p-12 text-center text-text-muted">
          <p className="text-lg font-medium text-text-primary mb-1">Start typing to search</p>
          <p>Find matches, players, and teams across the platform.</p>
        </CardContent>
      </Card>
    </div>
  )
}
