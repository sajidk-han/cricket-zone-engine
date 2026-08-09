"use client"

import React, { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { parseLiveStreamUrl } from '../../utils/liveStreamParser'
import { updateLiveStreamUrl } from '@/app/actions/matches'
import { Play, Globe, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'

export function LiveStreamSettingsForm({ matchId, initialUrl }: { matchId: string, initialUrl: string | null }) {
  const [url, setUrl] = useState(initialUrl || '')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' })

  const parsed = url ? parseLiveStreamUrl(url) : null

  const handleSave = () => {
    setStatus({ type: 'idle', message: '' })
    startTransition(async () => {
      const res = await updateLiveStreamUrl(matchId, url || null)
      if (res.success) {
        setStatus({ type: 'success', message: res.message })
      } else {
        setStatus({ type: 'error', message: res.message })
      }
    })
  }

  const handleRemove = () => {
    setUrl('')
    startTransition(async () => {
      const res = await updateLiveStreamUrl(matchId, null)
      if (res.success) {
        setStatus({ type: 'success', message: "Live stream removed successfully" })
      } else {
        setStatus({ type: 'error', message: res.message })
      }
    })
  }

  return (
    <Card className="bg-bg-surface border-bg-elevated max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎥</span> Live Stream Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            YouTube or Facebook Live URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setStatus({ type: 'idle', message: '' })
              }}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="flex-1 min-w-0 bg-bg-base border border-bg-elevated rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
            />
            <div className="flex gap-2 shrink-0">
              <Button onClick={handleSave} disabled={isPending || (!!url && !parsed)} variant="primary" className="flex-1 sm:flex-none">
                {isPending ? 'Saving...' : 'Save'}
              </Button>
              {initialUrl && (
                <Button onClick={handleRemove} disabled={isPending} variant="danger" className="px-3 shrink-0">
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Client-Side Validation Feedback */}
        {url && !parsed && (
          <div className="flex items-start gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>Unsupported streaming URL. Please enter a valid YouTube or Facebook Live URL.</p>
          </div>
        )}

        {url && parsed && (
          <div className="flex items-start gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg text-sm border border-green-500/20">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <p className="flex items-center gap-1 font-medium">
              {parsed.provider === 'youtube' ? <Play size={16} className="text-red-500"/> : <Globe size={16} className="text-blue-500"/>}
              {parsed.provider === 'youtube' ? 'YouTube' : 'Facebook'} stream detected. Ready to save.
            </p>
          </div>
        )}

        {/* Server Action Feedback */}
        {status.type === 'success' && (
          <div className="text-sm text-green-500 font-medium">{status.message}</div>
        )}
        {status.type === 'error' && (
          <div className="text-sm text-red-500 font-medium">{status.message}</div>
        )}
      </CardContent>
    </Card>
  )
}
