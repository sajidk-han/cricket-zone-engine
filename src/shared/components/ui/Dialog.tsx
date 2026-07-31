import React from 'react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg">
        {/* Clickaway backdrop */}
        <div className="fixed inset-0" onClick={onClose}></div>
        
        {/* Dialog Content */}
        <div className="relative bg-bg-surface rounded-xl shadow-2xl border border-bg-elevated flex flex-col w-full pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export function DialogHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 text-center sm:text-left border-b border-bg-elevated ${className}`}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`}>
      {children}
    </h2>
  )
}

export function DialogContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function DialogFooter({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-bg-elevated ${className}`}>
      {children}
    </div>
  )
}
