import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'

interface UnderConstructionPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export function UnderConstructionPage({
  title,
  description,
  icon: Icon,
}: UnderConstructionPageProps) {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[{ label: title }]}
      />

      <Card className="overflow-hidden !p-0">
        <div className="border-b border-gh-border bg-gradient-to-r from-gh-accent/[0.06] to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gh-accent/10 text-gh-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gh-fg">{title}</h3>
              <p className="mt-1 text-sm text-gh-fg-muted">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-gh-border bg-gh-canvas-subtle/60">
            <Construction className="h-6 w-6 text-gh-fg-subtle" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-semibold text-gh-fg">Under construction</p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-gh-fg-muted">
            This module is being prepared. Check back soon for {title.toLowerCase()} features.
          </p>
        </div>
      </Card>
    </div>
  )
}
