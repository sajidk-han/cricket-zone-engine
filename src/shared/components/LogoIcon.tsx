import React from 'react'
import Image from 'next/image'

export function LogoIcon({ size = 32, className = "" }: { size?: number, className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image 
        src="/icon-192x192.png" 
        alt="CricketZone Logo" 
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority
      />
    </div>
  )
}
