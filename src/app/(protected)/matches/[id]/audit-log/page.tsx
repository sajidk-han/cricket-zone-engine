import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { ShieldCheck, History } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { getMatchSummary } from '@/app/actions/matches'
import { notFound } from 'next/navigation'

export default async function AuditLogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getMatchSummary(resolvedParams.id)
  if (!res.success || !res.data) notFound()

  // In a real implementation, we'd fetch from an audit table
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('match_events')
    .select('*')
    .eq('match_id', resolvedParams.id)
    .order('event_time', { ascending: false })

  return (
    <div className="space-y-6">
      <Card className="bg-bg-surface border-bg-elevated">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <ShieldCheck size={24} className="text-brand-primary" />
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-widest">Enterprise Audit Log</h2>
          </div>

          <div className="space-y-4">
            {logs && logs.length > 0 ? logs.map((log: any) => (
              <div key={log.id} className="p-4 bg-bg-elevated/50 border border-white/5 rounded-lg flex items-start gap-4">
                <History size={16} className="text-text-secondary mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-text-primary font-medium capitalize">{log.event_type.replace('_', ' ')}</p>
                  <p className="text-xs text-text-muted mt-1">{new Date(log.event_time).toLocaleString()}</p>
                </div>
                {log.performed_by && (
                   <div className="text-xs text-text-secondary bg-black/20 px-2 py-1 rounded">User: {log.performed_by}</div>
                )}
              </div>
            )) : (
              <p className="text-text-muted text-sm text-center py-8">No audit logs available for this match.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
