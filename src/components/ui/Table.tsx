import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-gh-border', className)}>
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-gh-canvas-subtle border-b border-gh-border">
      {children}
    </thead>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gh-border">{children}</tbody>
}

export function TableRow({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <tr
      className={cn(
        'bg-gh-canvas transition-colors duration-100 hover:bg-gh-canvas-subtle',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export function TableHead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold text-gh-fg-muted uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function TableCell({
  children,
  className,
  colSpan,
}: {
  children: ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td colSpan={colSpan} className={cn('px-4 py-3 text-gh-fg', className)}>
      {children}
    </td>
  )
}
