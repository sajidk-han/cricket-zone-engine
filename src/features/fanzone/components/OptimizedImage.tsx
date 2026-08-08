'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ShieldAlert } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallbackInitials?: string
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill = false,
  className = '',
  fallbackInitials 
}: OptimizedImageProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-bg-elevated ${className} ${fill ? 'absolute inset-0' : ''}`}>
        {fallbackInitials ? (
          <span className="font-black text-text-muted">{fallbackInitials}</span>
        ) : (
          <ShieldAlert size={24} className="text-text-muted opacity-50" />
        )}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={!fill ? (width || 400) : undefined}
        height={!fill ? (height || 400) : undefined}
        fill={fill}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setError(true)}
        // Next.js handles WebP/AVIF auto-negotiation and lazy loading out of the box
        loading="lazy" 
      />
    </div>
  )
}
