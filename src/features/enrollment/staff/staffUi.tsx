import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Search } from 'lucide-react'
import type { StudentEnrollmentStatus } from '@/features/enrollment/staff/staffStudentData'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export const studentEnrollmentStatusConfig = {
  pending: { label: 'Pending', variant: 'warning' as const },
  under_review: { label: 'Under review', variant: 'info' as const },
  approved: { label: 'Approved', variant: 'success' as const },
  enrolled: { label: 'Enrolled', variant: 'success' as const },
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

interface StaffPanelProps {
  icon: LucideIcon
  accent?: 'accent' | 'sky' | 'emerald' | 'violet'
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

const accentStyles = {
  accent: {
    header: 'from-gh-accent/[0.07] to-transparent',
    icon: 'bg-gh-accent/10 text-gh-accent',
  },
  sky: {
    header: 'from-sky-500/[0.08] to-transparent',
    icon: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  emerald: {
    header: 'from-emerald-500/[0.08] to-transparent',
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    header: 'from-violet-500/[0.08] to-transparent',
    icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
}

export function StaffPanel({
  icon: Icon,
  accent = 'accent',
  title,
  description,
  actions,
  children,
  className,
}: StaffPanelProps) {
  const styles = accentStyles[accent]

  return (
    <Card className={cn('overflow-hidden !p-0 shadow-sm', className)}>
      <div
        className={cn(
          'border-b border-gh-border bg-gradient-to-r px-5 py-4 sm:px-6 sm:py-5',
          styles.header,
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm',
                styles.icon,
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-gh-fg sm:text-lg">
                {title}
              </h3>
              {description && (
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gh-fg-muted">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions}
        </div>
      </div>
      {children}
    </Card>
  )
}

interface StaffStatCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone?: 'default' | 'warning' | 'success' | 'info'
}

const statTones = {
  default: 'bg-gh-accent/10 text-gh-accent',
  warning: 'bg-gh-warning-subtle text-gh-warning',
  success: 'bg-gh-success-subtle text-gh-success',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
}

export function StaffStatCard({ label, value, icon: Icon, tone = 'default' }: StaffStatCardProps) {
  return (
    <Card className="group relative overflow-hidden !p-4 transition-shadow hover:shadow-md">
      <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gh-accent/[0.04] transition-transform group-hover:scale-110" />
      <div className="relative flex items-center gap-3.5">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
            statTones[tone],
          )}
        >
          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gh-fg-subtle">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold leading-none tabular-nums text-gh-fg">
            {value}
          </p>
        </div>
      </div>
    </Card>
  )
}

interface StaffEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function StaffEmptyState({ icon: Icon, title, description, action }: StaffEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-gh-border bg-gh-canvas-subtle/60">
        <Icon className="h-6 w-6 text-gh-fg-subtle" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-semibold text-gh-fg">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-gh-fg-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StudentEnrollmentStatusBadge({ status }: { status: StudentEnrollmentStatus }) {
  const config = studentEnrollmentStatusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

interface StaffSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
  className?: string
}

export function StaffSearchInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: StaffSearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gh-fg-subtle"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 border-gh-border/80 bg-gh-canvas pl-9 shadow-sm"
        aria-label={ariaLabel}
      />
    </div>
  )
}

interface StaffFilterPillsProps<T extends string> {
  options: Array<{ label: string; value: T }>
  value: T
  onChange: (value: T) => void
}

export function StaffFilterPills<T extends string>({
  options,
  value,
  onChange,
}: StaffFilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ label, value: optionValue }) => (
        <button
          key={optionValue}
          type="button"
          onClick={() => onChange(optionValue)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150',
            value === optionValue
              ? 'bg-gh-accent text-gh-accent-fg shadow-sm'
              : 'border border-gh-border bg-gh-canvas text-gh-fg-muted hover:border-gh-accent/30 hover:bg-gh-canvas-subtle hover:text-gh-fg',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
