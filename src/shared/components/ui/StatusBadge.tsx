import React from 'react'

export type MatchStatus = 'live' | 'toss' | 'playing_xi' | 'scheduled' | 'completed' | 'abandoned' | 'delayed' | 'cancelled'

interface StatusBadgeProps {
  status: MatchStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let label = status.replace('_', ' ').toUpperCase()
  
  // Map statuses to semantic colors based on design tokens
  let bgColor = 'bg-status-neutral/10'
  let textColor = 'text-status-neutral'
  let ringColor = 'ring-status-neutral/20'
  let isPulsing = false

  switch (status) {
    case 'live':
    case 'toss':
    case 'playing_xi':
      bgColor = 'bg-status-danger/10'
      textColor = 'text-status-danger shadow-[0_0_10px_rgba(248,113,113,0.3)]'
      ringColor = 'ring-status-danger/30'
      isPulsing = true
      label = status === 'live' ? 'LIVE' : label
      break
    case 'scheduled':
      bgColor = 'bg-bg-elevated/50'
      textColor = 'text-text-secondary'
      ringColor = 'ring-border-dim'
      label = 'UPCOMING'
      break
    case 'completed':
      bgColor = 'bg-status-success/10'
      textColor = 'text-status-success'
      ringColor = 'ring-status-success/20'
      break
    case 'abandoned':
      bgColor = 'bg-status-warning/10'
      textColor = 'text-status-warning'
      ringColor = 'ring-status-warning/20'
      break
    case 'delayed':
      bgColor = 'bg-status-orange/10'
      textColor = 'text-status-orange'
      ringColor = 'ring-status-orange/20'
      break
  }

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ring-1 ring-inset ${bgColor} ${textColor} ${ringColor} ${className}`}>
      {isPulsing && <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />}
      {label}
    </div>
  )
}
