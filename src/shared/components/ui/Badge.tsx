import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider'
  
  const variantClasses = {
    default: 'bg-bg-elevated text-text-primary',
    success: 'bg-green-900/40 text-green-400 border border-green-800/50',
    warning: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50',
    danger: 'bg-red-900/40 text-red-400 border border-red-800/50',
    outline: 'bg-transparent text-text-secondary border border-bg-elevated'
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
