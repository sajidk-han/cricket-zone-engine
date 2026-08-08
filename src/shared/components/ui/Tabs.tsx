"use client"

import React, { useState } from 'react'

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  // Map over children to inject activeTab state (Simplified for foundation review)
  const elements = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab } as any)
    }
    return child
  })

  return <div className={`w-full ${className}`}>{elements}</div>
}

export function TabsList({ children, className = '', activeTab, setActiveTab }: any) {
  const elements = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab })
    }
    return child
  })

  return (
    <div className={`flex space-x-1 rounded-xl bg-bg-surface p-1 mb-4 border border-bg-elevated ${className}`}>
      {elements}
    </div>
  )
}

export function TabsTrigger({ value, children, activeTab, setActiveTab, className = '' }: any) {
  const isActive = activeTab === value
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        w-full flex items-center justify-center py-2.5 text-sm font-medium leading-5 rounded-lg transition-all
        focus:outline-none focus:ring-2 ring-brand-primary ring-opacity-60
        ${isActive 
          ? 'bg-bg-elevated text-white shadow-sm' 
          : 'text-text-secondary hover:bg-bg-elevated hover:text-white'
        } ${className}
      `}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, activeTab, children, className = '' }: any) {
  if (activeTab !== value) return null
  return <div className={`focus:outline-none ${className}`}>{children}</div>
}
