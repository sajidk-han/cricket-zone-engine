import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { BarChart3 } from 'lucide-react'

export default function RankingsPage() {
  return (
    <div className="md:ml-64 p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-text-primary mb-6">Global Rankings</h1>

      <Card className="border-dashed border-bg-elevated bg-transparent">
        <CardContent className="p-12 text-center text-text-muted">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-text-primary mb-1">Rankings Coming Soon</p>
          <p>We are aggregating data across all teams to calculate global rankings.</p>
        </CardContent>
      </Card>
    </div>
  )
}
