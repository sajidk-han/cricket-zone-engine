import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
}

export function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  
  // Base classes (Premium feel, rounded corners, transitions)
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-[var(--animate-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Size variations (Strict 8px spacing rules)
  const sizeClasses = {
    xs: 'h-6 px-2 text-xs rounded-sm',
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    xl: 'h-14 px-10 text-lg rounded-lg'
  }
  
  // Variant variations (Using Design Tokens)
  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-brand-secondary text-white hover:bg-violet-700 shadow-sm',
    outline: 'border border-bg-elevated bg-transparent hover:bg-bg-elevated text-text-primary',
    ghost: 'bg-transparent hover:bg-bg-elevated text-text-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
  }

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}


