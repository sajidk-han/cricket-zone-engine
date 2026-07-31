import React from 'react'

export function Table({ className = '', children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto rounded-lg border border-bg-elevated">
      <table className={`w-full text-sm text-left ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`text-xs text-text-secondary uppercase bg-bg-surface border-b border-bg-elevated ${className}`} {...props}>
      {children}
    </thead>
  )
}

export function TableRow({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-b border-bg-elevated bg-bg-base hover:bg-bg-surface transition-colors ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function TableCell({ className = '', children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-6 py-4 font-medium text-text-primary whitespace-nowrap ${className}`} {...props}>
      {children}
    </td>
  )
}

export function TableHead({ className = '', children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th scope="col" className={`px-6 py-3 ${className}`} {...props}>
      {children}
    </th>
  )
}
