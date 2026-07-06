import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import type { BreadcrumbItem } from '@/types'
import { cn } from '@/utils/cn'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex flex-wrap items-center gap-x-1 gap-y-2 text-sm', className)}
    >
      <Link
        to="/dashboard"
        className="text-gh-fg-muted hover:text-gh-accent transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-gh-fg-subtle" aria-hidden="true" />
          {item.path && i < items.length - 1 ? (
            <Link
              to={item.path}
              className="text-gh-fg-muted hover:text-gh-accent transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gh-fg font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
