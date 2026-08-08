import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Wifi, Activity, Server, Lock, Clock } from 'lucide-react'

export function ConnectivityPanelWidget({ 
  isOffline, 
  queueLength, 
  localVersion, 
  serverVersion 
}: { 
  isOffline: boolean, 
  queueLength: number, 
  localVersion: number, 
  serverVersion: number 
}) {
  const syncStatus = queueLength > 0 ? 'Syncing...' : (isOffline ? 'Offline' : 'Synced');
  
  return (
    <Card className="bg-bg-surface border-bg-elevated">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Server size={12} className="text-brand-primary" /> Connectivity
          </h3>
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border
            ${isOffline ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              (queueLength > 0 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')}`}>
            {syncStatus}
          </span>
        </div>

        <div className="space-y-3">
          <DiagnosticRow icon={<Wifi size={12} className={isOffline ? "text-red-400" : "text-emerald-400"} />} label="Network" value={isOffline ? 'Offline' : 'Online'} />
          <DiagnosticRow icon={<Activity size={12} className="text-blue-400"/>} label="Queue Length" value={queueLength.toString()} />
          <DiagnosticRow icon={<Clock size={12} className="text-purple-400"/>} label="Version" value={`v${localVersion} (Server: v${serverVersion})`} />
          <DiagnosticRow icon={<Lock size={12} className="text-orange-400"/>} label="Lock Owner" value="Me (Current Session)" />
        </div>
      </CardContent>
    </Card>
  )
}

function DiagnosticRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  )
}
