import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Trophy, Users, CalendarDays, Activity } from 'lucide-react'
import { getTournamentById } from '@/app/actions/tournaments'

export default async function TournamentDashboardOverview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getTournamentById(resolvedParams.id)
  if (!res.success || !res.data) return null

  // For MVP Day 1, we will show static placeholder widgets as per requirement 4, but wired up visually.
  return (
    <div className="space-y-6">
      
      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Widget title="Registered Teams" value="0" icon={<Users className="text-blue-400" size={20} />} />
        <Widget title="Scheduled Matches" value="0" icon={<CalendarDays className="text-amber-400" size={20} />} />
        <Widget title="Live Matches" value="0" icon={<Activity className="text-red-400" size={20} />} />
        <Widget title="Completed Matches" value="0" icon={<Trophy className="text-emerald-400" size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-bg-surface border-bg-elevated h-96">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-text-muted">
               <Activity size={48} className="opacity-20 mb-4" />
               <p>Activity Timeline will appear here</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-bg-surface border-bg-elevated h-96">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-text-muted">
               <Trophy size={48} className="opacity-20 mb-4" />
               <p>Standings Summary</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Widget({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-bg-surface border-bg-elevated">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-3 bg-bg-elevated rounded-xl">
          {icon}
        </div>
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-black text-text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
