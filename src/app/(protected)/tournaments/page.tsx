import React, { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Trophy, Calendar, MapPin, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { getTournaments, deleteTournament } from '@/app/actions/tournaments'
import { DeleteEntityButton } from '@/shared/components/ui/DeleteEntityButton'

export const metadata = {
  title: 'Tournaments | CricketZone Enterprise',
  description: 'Manage your organization\'s cricket tournaments',
}

function TournamentSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse bg-bg-surface/50 border-bg-elevated">
          <CardContent className="p-6">
            <div className="h-4 bg-bg-elevated rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-bg-elevated rounded w-3/4 mb-4"></div>
            <div className="flex gap-4 mb-6">
               <div className="h-4 bg-bg-elevated rounded w-1/4"></div>
               <div className="h-4 bg-bg-elevated rounded w-1/4"></div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-bg-elevated/50">
              <div className="h-8 bg-bg-elevated rounded-full w-24"></div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-bg-elevated"></div>
                <div className="w-8 h-8 rounded-full bg-bg-elevated"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-bg-elevated rounded-2xl bg-bg-surface/30 mt-8">
      <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-primary/5">
        <Trophy size={48} className="text-brand-primary" />
      </div>
      <h3 className="text-2xl font-black text-text-primary mb-2">No Tournaments Yet</h3>
      <p className="text-text-secondary max-w-md mb-8">
        Get started by creating your first tournament. Set up formats, manage teams, and schedule matches all in one place.
      </p>
      <div className="flex gap-4">
        <Link href="/tournaments/new">
          <Button variant="primary" className="gap-2">
            <Plus size={18} /> Create Tournament
          </Button>
        </Link>
        <Link href="https://docs.cricketzone.com/tournaments" target="_blank" rel="noreferrer">
          <Button variant="outline">Read Documentation</Button>
        </Link>
      </div>
    </div>
  )
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    registration_open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    registration_closed: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    live: 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse',
    completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    archived: 'bg-slate-800 text-slate-500 border-slate-700'
  }
  const formattedStatus = status.replace('_', ' ').toUpperCase()
  const style = styles[status] || styles.draft

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${style}`}>
      {formattedStatus}
    </span>
  )
}

async function TournamentList() {
  const res = await getTournaments()
  
  if (!res.success) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
        <h3 className="font-bold mb-2">Failed to load tournaments</h3>
        <p className="text-sm opacity-80">{res.message}</p>
      </div>
    )
  }

  const tournaments = res.data || []

  if (tournaments.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {tournaments.map((t: any) => (
        <Card key={t.id} className="group hover:border-green-400/50 transition-all duration-300 bg-bg-surface border-bg-elevated hover:shadow-xl hover:shadow-green-400/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6 relative z-10 flex flex-col h-full">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <DeleteEntityButton 
                id={t.id} 
                onDelete={deleteTournament} 
                confirmMessage="Are you sure you want to delete this tournament? This action is irreversible."
                iconOnly={true}
              />
            </div>
            <div className="flex justify-between items-start mb-4 pr-8">
              {getStatusBadge(t.status)}
              <span className="text-xs font-medium text-text-muted bg-bg-elevated px-2 py-1 rounded-md">
                {t.settings?.match_format?.toUpperCase() || 'T20'}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-1">{t.name}</h3>
            
            <div className="flex flex-col gap-2 mb-6 flex-1">
              {t.start_date && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Calendar size={14} className="opacity-70" />
                  <span>{new Date(t.start_date).toLocaleDateString()} - {t.end_date ? new Date(t.end_date).toLocaleDateString() : 'TBD'}</span>
                </div>
              )}
            </div>

            <div className="pt-5 border-t border-bg-elevated/50 flex justify-center items-center w-full mt-auto">
              <Link href={`/tournaments/${t.id}/dashboard`} className="w-full">
                <button className="w-full h-11 bg-brand-primary hover:bg-brand-primary/90 text-bg-base font-bold text-sm rounded-lg transition-all duration-200 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                  Manage Workspace
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function TournamentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Tournaments</h1>
          <p className="text-text-secondary mt-1">Manage and organize your cricket events</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              className="w-full bg-bg-surface border border-bg-elevated rounded-lg py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>
          <Link href="/tournaments/new" className="shrink-0">
            <Button variant="primary" className="gap-2 rounded-lg">
              <Plus size={18} /> New
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<TournamentSkeleton />}>
        <TournamentList />
      </Suspense>
    </div>
  )
}
