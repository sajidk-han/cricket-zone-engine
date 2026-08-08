"use client"

import React, { useState, useEffect } from 'react'

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      
      if (difference <= 0) {
        return '00:00:00'
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      if (days > 0) {
        return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // Return a placeholder of the same size while hydrating to avoid layout shift
  if (!timeLeft) {
    return (
      <div className="text-xl sm:text-2xl font-black text-transparent font-mono bg-black/40 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/10 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] text-center min-w-[140px] whitespace-nowrap animate-pulse">
        00:00:00
      </div>
    )
  }

  return (
    <div className="text-xl sm:text-2xl font-black text-white font-mono bg-black/40 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/10 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] text-center min-w-[140px] whitespace-nowrap">
      {timeLeft}
    </div>
  )
}
