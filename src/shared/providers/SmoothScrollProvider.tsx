"use client"
import React, { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Lenis smooth scrolling was breaking native mouse wheel scroll, disabled for now.

  return <>{children}</>
}
