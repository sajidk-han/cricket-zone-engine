import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import Link from 'next/link'
import { fetchDashboardStats } from '@/app/actions/dashboard'
import { ActivityChart } from '@/features/dashboard/components/ActivityChart'
import { ArrowUpRight, Trophy, Shield, User, PlayCircle } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await fetchDashboardStats()

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Organization Overview</h1>
          <p className="text-text-secondary mt-1">Monitor your tournaments, teams, and live matches.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/tournaments/new">
            <Button variant="primary">
              <Trophy size={16} className="mr-2" /> New Tournament
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Active Tournaments" 
          value={stats.activeTournaments} 
          icon={<Trophy className="text-brand-primary" />} 
          trend={<span className="text-brand-accent flex items-center"><ArrowUpRight size={14} className="mr-1"/> 12% this month</span>} 
        />
        <SummaryCard 
          title="Live Matches" 
          value={stats.liveMatches} 
          icon={<PlayCircle className="text-red-500" />} 
          trend={<span className="text-text-muted">No active streams</span>} 
        />
        <SummaryCard 
          title="Registered Teams" 
          value={stats.registeredTeams} 
          icon={<Shield className="text-brand-secondary" />} 
          trend={<span className="text-brand-accent flex items-center"><ArrowUpRight size={14} className="mr-1"/> 4 new this week</span>} 
        />
        <SummaryCard 
          title="Total Players" 
          value={stats.totalPlayers} 
          icon={<User className="text-blue-400" />} 
          trend={<span className="text-text-muted">Across all teams</span>} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recharts Activity Graph */}
        <ActivityChart data={stats.activityChartData} />

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/teams" className="p-4 rounded-xl border border-bg-elevated hover:bg-bg-elevated/50 transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <span className="text-sm font-medium text-text-primary">Add Team</span>
              </Link>
              <Link href="/players" className="p-4 rounded-xl border border-bg-elevated hover:bg-bg-elevated/50 transition-colors flex flex-col items-center justify-center text-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <User size={20} />
                </div>
                <span className="text-sm font-medium text-text-primary">Add Player</span>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-bg-elevated">
                {stats.recentTournaments.length === 0 ? (
                  <div className="p-6 text-center text-text-secondary text-sm">No activity yet.</div>
                ) : (
                  stats.recentTournaments.map((t, idx) => (
                    <ActivityItem key={idx} title="Tournament Created" desc={`${t.name} published`} time={new Date(t.created_at).toLocaleDateString()} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, icon, trend }: any) {
  return (
    <Card className="hover:border-bg-elevated/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-3xl font-black text-text-primary mt-2">{value}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-surface border border-bg-elevated flex items-center justify-center shadow-sm">
            {icon}
          </div>
        </div>
        <div className="mt-4 text-xs font-medium">
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ title, desc, time }: any) {
  return (
    <div className="p-4 flex gap-4 hover:bg-bg-surface transition-colors cursor-pointer group">
      <div className="w-2 h-2 mt-2 rounded-full bg-brand-primary shrink-0 group-hover:scale-125 transition-transform" />
      <div>
        <p className="text-sm font-bold text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-1">{desc}</p>
        <p className="text-xs text-text-muted mt-2">{time}</p>
      </div>
    </div>
  )
}

