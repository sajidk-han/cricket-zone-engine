"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react'

export function ScoringTerminal({ matchId }: { matchId: string }) {
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline_changes'>('synced')

  // Offline Strategy Listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setSyncStatus('syncing')
      // Simulate sync
      setTimeout(() => setSyncStatus('synced'), 1500)
    }
    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus('offline_changes')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial check
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="h-full flex flex-col bg-[#0f0f11] text-text-primary rounded-xl overflow-hidden border border-bg-elevated shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Terminal Top Bar */}
      <div className="h-14 bg-bg-surface border-b border-bg-elevated flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black text-white tracking-widest uppercase text-sm">Live Match Engine</span>
          </div>
          <span className="text-text-muted text-xs font-mono">ID: {matchId}</span>
        </div>
        
        {/* Network & Sync Status (Offline-First Strategy) */}
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <Wifi size={14} /> 
              {syncStatus === 'syncing' ? 'Syncing...' : 'Online'}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
              <WifiOff size={14} /> Offline Mode
            </div>
          )}
          
          {syncStatus === 'offline_changes' && isOnline && (
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw size={12} className="mr-2 animate-spin" /> Force Sync
            </Button>
          )}
        </div>
      </div>

      {/* Main Scoring Area */}
      <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-bg-elevated">
        
        {/* Left: Scoreboard & Current State */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-brand-primary font-bold tracking-wider text-sm mb-1 uppercase">Eagles CC (Batting)</p>
              <h1 className="text-7xl font-black text-white tabular-nums tracking-tighter">
                145 <span className="text-4xl text-text-secondary font-medium">/ 4</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="text-text-secondary font-bold tracking-wider text-sm mb-1 uppercase">Overs</p>
              <h1 className="text-5xl font-black text-white tabular-nums tracking-tighter">15.2</h1>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-bg-base border border-bg-elevated rounded-xl p-4">
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Current Run Rate</p>
              <p className="text-2xl font-black text-white">9.45</p>
            </div>
            <div className="flex-1 bg-bg-base border border-bg-elevated rounded-xl p-4">
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Target</p>
              <p className="text-2xl font-black text-white">---</p>
            </div>
          </div>
          
          {/* Active Batsmen */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Batters</h3>
            <div className="flex justify-between items-center bg-brand-primary/10 border border-brand-primary/20 p-3 rounded-lg">
              <span className="font-bold text-white flex items-center gap-2">Babar Azam <span className="text-brand-primary">*</span></span>
              <span className="font-mono text-lg font-bold">54 <span className="text-sm text-text-secondary">(31)</span></span>
            </div>
            <div className="flex justify-between items-center bg-bg-base border border-bg-elevated p-3 rounded-lg">
              <span className="font-bold text-text-primary">Fakhar Zaman</span>
              <span className="font-mono text-lg font-bold">22 <span className="text-sm text-text-secondary">(15)</span></span>
            </div>
          </div>
        </div>

        {/* Right: Input Terminal */}
        <div className="w-full lg:w-96 bg-bg-surface p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Scoring Input</h3>
            <Zap size={16} className="text-brand-primary" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 6].map(runs => (
              <Button key={runs} variant="outline" className="h-16 text-2xl font-black font-mono shadow-sm hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                {runs}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline" className="h-12 text-sm font-bold text-orange-400 border-orange-400/20 hover:bg-orange-500/10">Wide (wd)</Button>
            <Button variant="outline" className="h-12 text-sm font-bold text-orange-400 border-orange-400/20 hover:bg-orange-500/10">No Ball (nb)</Button>
            <Button variant="outline" className="h-12 text-sm font-bold text-text-primary border-bg-elevated hover:bg-bg-elevated">Leg Bye (lb)</Button>
            <Button variant="outline" className="h-12 text-sm font-bold text-text-primary border-bg-elevated hover:bg-bg-elevated">Bye (b)</Button>
          </div>

          <Button variant="primary" className="h-14 w-full text-lg mt-auto shadow-[0_0_20px_rgba(37,99,235,0.3)] bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider border-none">
            Wicket!
          </Button>
        </div>

      </div>
    </div>
  )
}
