import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Trophy, Users, Shield, Calendar, PlayCircle } from 'lucide-react'
import { DeleteEntityButton } from '@/shared/components/ui/DeleteEntityButton'
import { deleteTournament, getTournamentById } from '@/app/actions/tournaments'
import { notFound } from 'next/navigation'

export default async function TournamentWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const tournamentId = resolvedParams.id
  const response = await getTournamentById(tournamentId)
  
  if (!response.success || !response.data) {
    notFound()
  }
  
  const tournament = response.data
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-8 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/20 blur-3xl rounded-full" />
        
        <div className="flex gap-6 items-center relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-bg-surface border border-brand-primary/30 flex items-center justify-center shadow-lg">
            <Trophy size={48} className="text-brand-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                {tournament.status === 'draft' ? 'Draft' : 'Ongoing'}
              </span>
              <span className="text-sm font-medium text-text-secondary">{tournament.settings?.match_format?.toUpperCase() || 'T20'} Format</span>
            </div>
            <h1 className="text-4xl font-black text-text-primary tracking-tight">{tournament.name}</h1>
            <p className="text-text-secondary mt-1 flex items-center gap-2">
              <Calendar size={14} /> {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'} - {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'TBD'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 items-center relative z-10 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">Edit Settings</Button>
          <DeleteEntityButton 
            id={tournament.id} 
            onDelete={deleteTournament} 
            confirmMessage={`Are you sure you want to delete ${tournament.name}?`}
            redirectTo="/tournaments"
          />
          <Button variant="primary" className="flex-1 md:flex-none">
            <PlayCircle size={16} className="mr-2" /> Start Live Match
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-bg-elevated/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand-secondary/10 text-brand-secondary">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Registered Teams</p>
                <p className="text-2xl font-black text-text-primary mt-1">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:border-bg-elevated/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Players</p>
                <p className="text-2xl font-black text-text-primary mt-1">180</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-bg-elevated/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
                <PlayCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Matches Played</p>
                <p className="text-2xl font-black text-text-primary mt-1">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}
