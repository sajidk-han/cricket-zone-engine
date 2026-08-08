"use client"

import React, { useState } from 'react'
import { Users, Plus, ShieldAlert } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { EnrollTeamModal } from '@/features/tournaments/components/EnrollTeamModal'

type TournamentTeamsClientProps = {
  tournamentId: string
  initialTeams: any[]
}

export function TournamentTeamsClient({ tournamentId, initialTeams }: TournamentTeamsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // For MVP, if we mutate, we just refresh the page. Next.js router.refresh() works well here.
  
  const enrolledIds = initialTeams.map(t => t.team.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Participating Teams</h2>
          <p className="text-sm text-text-secondary">Manage teams enrolled in this tournament</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Enroll Team
        </Button>
      </div>

      {initialTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-bg-elevated rounded-2xl bg-bg-surface/30 mt-8">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-primary/5">
            <Users size={40} className="text-brand-primary" />
          </div>
          <h3 className="text-xl font-black text-text-primary mb-2">No Teams Enrolled</h3>
          <p className="text-text-secondary max-w-md mb-8">
            This tournament doesn't have any teams yet. Enroll teams from your organization to start scheduling matches.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>Enroll First Team</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialTeams.map((enrolled) => (
            <Card key={enrolled.id} className="bg-bg-surface border-bg-elevated hover:border-brand-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center font-bold text-text-primary text-xl shadow-inner">
                  {enrolled.team.logo_url ? (
                    <img src={enrolled.team.logo_url} alt={enrolled.team.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    enrolled.team.short_name
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-primary">{enrolled.team.name}</h3>
                  <p className="text-sm text-text-secondary">Enrolled on {new Date(enrolled.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EnrollTeamModal 
        tournamentId={tournamentId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alreadyEnrolledIds={enrolledIds}
        onSuccess={() => {
          setIsModalOpen(false)
          window.location.reload() // Simple refresh to show new data
        }}
      />
    </div>
  )
}
