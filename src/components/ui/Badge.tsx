import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gh-canvas-subtle text-gh-fg border-gh-border',
  success: 'bg-gh-success-subtle text-gh-success border-transparent',
  warning: 'bg-gh-warning-subtle text-gh-warning border-transparent',
  danger: 'bg-gh-danger-subtle text-gh-danger border-transparent',
  info: 'bg-gh-canvas-subtle text-gh-accent border-transparent',
  outline: 'bg-transparent text-gh-fg-muted border-gh-border',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
