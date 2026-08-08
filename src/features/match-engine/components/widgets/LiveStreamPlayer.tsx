"use client"

import React, { useState } from 'react'
import { parseLiveStreamUrl } from '../../utils/liveStreamParser'
import { MatchStatus } from '@/shared/components/ui/StatusBadge'
import { ExternalLink, VideoOff } from 'lucide-react'

interface LiveStreamPlayerProps {
  url: string | null
  status: MatchStatus
}

export function LiveStreamPlayer({ url, status }: LiveStreamPlayerProps) {
  const [hasError, setHasError] = useState(false)

  if (!url) return null

  const parsed = parseLiveStreamUrl(url)

  if (!parsed || hasError) {
    return (
      <div className="w-full bg-bg-surface/50 border border-bg-elevated rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4">
        <VideoOff size={48} className="text-text-muted opacity-50" />
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Live Stream Unavailable</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            This stream cannot currently be embedded. It might have restrictions or be in an unsupported format.
          </p>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          <ExternalLink size={16} />
          Open {parsed ? (parsed.provider === 'youtube' ? 'on YouTube' : 'on Facebook') : 'Externally'}
        </a>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl group">
      {/* Live Badge */}
      {status === 'live' && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          <span className="text-xs font-black text-white tracking-widest uppercase">Live</span>
        </div>
      )}

      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full pt-[56.25%]">
        <iframe
          src={parsed.embedUrl}
          title={`${parsed.provider} live stream`}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={() => setHasError(true)}
        ></iframe>
      </div>
    </div>
  )
}
