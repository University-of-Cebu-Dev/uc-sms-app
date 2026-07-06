import type { KeyboardEvent } from 'react'
import { CalendarDays, Check, Sparkles } from 'lucide-react'
import type { SchoolPeriod } from '@/types'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

interface SchoolPeriodItemProps {
  period: SchoolPeriod
  isSelected: boolean
  isCollapsed: boolean
  onSelect: (id: string) => void
}

export const SchoolPeriodItem = ({
  period,
  isSelected,
  isCollapsed,
  onSelect,
}: SchoolPeriodItemProps) => {
  const handleClick = () => onSelect(period.id)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(period.id)
    }
  }

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={period.name}
        aria-pressed={isSelected}
        aria-label={period.name}
        className={cn(
          'relative flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
          isSelected
            ? 'bg-gh-accent/10 ring-2 ring-gh-accent/30 scale-105 text-gh-accent'
            : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
        )}
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={cn(
        'group relative w-full rounded-lg border text-left transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
        isSelected
          ? cn(
              'border-gh-accent bg-gradient-to-br from-gh-accent/8 via-gh-canvas to-gh-canvas',
              'ring-2 ring-gh-accent/30 shadow-[0_0_0_1px_rgba(9,105,218,0.2),0_4px_16px_rgba(9,105,218,0.12)]',
              'animate-period-select',
            )
          : cn(
              'border-gh-border bg-gh-canvas hover:border-gh-accent/30 hover:bg-gh-canvas-subtle',
              'hover:shadow-sm hover:-translate-y-px',
            ),
      )}
    >
      {isSelected && (
        <span
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gh-accent animate-period-bar"
          aria-hidden="true"
        />
      )}

      <div className="relative p-3 pl-4 pr-10">
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
              isSelected
                ? 'bg-gh-accent text-gh-accent-fg shadow-sm'
                : 'bg-gh-canvas-subtle text-gh-fg-muted',
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-[13px] font-semibold leading-snug break-words transition-colors',
                isSelected ? 'text-gh-fg' : 'text-gh-fg group-hover:text-gh-fg',
              )}
            >
              {period.name}
            </p>

            <p className="text-xs text-gh-fg-muted mt-1.5 leading-relaxed">
              {formatDate(period.startDate)} – {formatDate(period.endDate)}
            </p>

            {isSelected && (
              <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-gh-accent animate-fade-in">
                <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
                Currently viewing
              </p>
            )}
          </div>
        </div>

        {isSelected && (
          <span
            className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gh-accent text-gh-accent-fg animate-period-check"
            aria-hidden="true"
          >
            <Check className="h-3 w-3 stroke-[3]" />
          </span>
        )}
      </div>
    </button>
  )
}
