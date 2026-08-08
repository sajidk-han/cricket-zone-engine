import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items, orgSlug }: { items: BreadcrumbItem[], orgSlug: string }) {
  return (
    <nav className="flex items-center text-xs text-text-muted mb-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
      <Link href={`/fanzone/${orgSlug}`} className="flex items-center hover:text-white transition-colors">
        <Home size={14} className="mr-1" />
        FanZone
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="mx-1 text-text-muted/50" />
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
