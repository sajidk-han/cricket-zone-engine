import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Trophy, Users, Shield, Calendar, PlayCircle } from 'lucide-react'

export default async function TournamentWorkspace({ params }: { params: { id: string } }) {
  const tournamentId = params.id
  
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
                Ongoing
              </span>
              <span className="text-sm font-medium text-text-secondary">T20 Format</span>
            </div>
            <h1 className="text-4xl font-black text-text-primary tracking-tight">Super League 2026</h1>
            <p className="text-text-secondary mt-1 flex items-center gap-2">
              <Calendar size={14} /> Aug 1, 2026 - Sep 15, 2026
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 relative z-10 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">Edit Settings</Button>
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
