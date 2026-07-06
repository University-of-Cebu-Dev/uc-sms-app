import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BreadcrumbPeriod } from '@/components/common/BreadcrumbPeriod'
import type { BreadcrumbItem } from '@/types'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-2" />
      )}
      <BreadcrumbPeriod className="mb-3" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gh-fg">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gh-fg-muted">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
