"use client"

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const variantColors = {
    danger: 'text-red-500 bg-red-500/10 border-red-500/20',
    warning: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    info: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  }

  const btnVariant = variant === 'danger' ? 'danger' : 'primary'

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined} />
      
      <div 
        className={`relative w-full max-w-md bg-bg-surface border border-bg-elevated rounded-2xl shadow-2xl p-6 transform transition-all duration-300 ease-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full border ${variantColors[variant]}`}>
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1 mt-1">
            <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={btnVariant as any} 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
