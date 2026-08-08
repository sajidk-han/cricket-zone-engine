"use client"

import React, { useState } from 'react'
import { Share2, Check, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { toast } from 'react-hot-toast'

type ShareButtonProps = {
  title: string
  text: string
  url?: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })
        toast.success("Shared successfully!")
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          handleFallback()
        }
      }
    } else {
      handleFallback()
    }
  }

  const handleFallback = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-8 gap-2 bg-bg-base/50 hover:bg-brand-primary/10 border-bg-elevated text-text-secondary hover:text-brand-primary transition-all"
      onClick={handleShare}
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
      <span className="text-xs font-bold uppercase tracking-wider">{copied ? 'Copied' : 'Share'}</span>
    </Button>
  )
}
