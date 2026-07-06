import { CalendarRange } from 'lucide-react'
import { useSchoolPeriod } from '@/hooks/useSchoolPeriod'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

export function BreadcrumbPeriod({ className }: { className?: string }) {
  const { selectedPeriod } = useSchoolPeriod()

  if (!selectedPeriod) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-gh-accent/25',
        'bg-gradient-to-r from-gh-accent/10 via-gh-canvas-subtle/80 to-gh-canvas',
        'px-2.5 py-1 shadow-[0_1px_3px_rgba(9,105,218,0.1)]',
        'transition-shadow hover:shadow-[0_2px_8px_rgba(9,105,218,0.14)]',
        className,
      )}
      aria-label={`School period: ${selectedPeriod.name}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gh-accent text-gh-accent-fg">
        <CalendarRange className="h-3 w-3" aria-hidden="true" />
      </span>

      <span className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-gh-fg leading-snug">
          {selectedPeriod.name}
        </span>
        <span className="hidden sm:inline text-gh-fg-subtle select-none" aria-hidden="true">
          ·
        </span>
        <span className="hidden sm:inline text-xs text-gh-fg-muted whitespace-nowrap">
          {formatDate(selectedPeriod.startDate)} – {formatDate(selectedPeriod.endDate)}
        </span>
      </span>
    </div>
  )
}
