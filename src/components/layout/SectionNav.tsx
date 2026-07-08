import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SectionNavItem {
  label: string
  path: string
  icon?: LucideIcon
  end?: boolean
  description?: string
}

interface SectionNavProps {
  items: SectionNavItem[]
  title?: string
  ariaLabel: string
  className?: string
}

export function SectionNav({ items, title, ariaLabel, className }: SectionNavProps) {
  return (
    <nav
      className={cn(
        'rounded-xl border border-gh-border bg-gh-canvas p-2 shadow-sm',
        className,
      )}
      aria-label={ariaLabel}
    >
      {title && (
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gh-fg-subtle">
          {title}
        </p>
      )}
      <ul className="space-y-0.5">
        {items.map(({ label, path, icon: Icon, end, description }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
                  isActive
                    ? 'bg-gh-accent text-gh-accent-fg shadow-sm'
                    : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {Icon && (
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">{label}</span>
                    {description && (
                      <span
                        className={cn(
                          'mt-0.5 block text-[11px] leading-snug',
                          isActive ? 'text-gh-accent-fg/80' : 'text-gh-fg-subtle',
                        )}
                      >
                        {description}
                      </span>
                    )}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
