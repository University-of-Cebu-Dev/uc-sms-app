import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

interface StudentDetailsProps {
  isCollapsed: boolean
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export const StudentDetails = ({ isCollapsed }: StudentDetailsProps) => {
  const { student } = useAuth()

  if (isCollapsed || !student) return null

  return (
    <section
      className="relative border-b border-gh-border px-4 py-2.5"
      aria-label="Student details"
    >
      <div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gh-accent/60"
        aria-hidden="true"
      />

      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            'bg-gh-accent/12 text-gh-accent ring-1 ring-gh-accent/20',
            'text-[11px] font-bold',
          )}
          aria-hidden="true"
        >
          {getInitials(student.completeName)}
        </div>

        <dl className="min-w-0 flex-1 leading-tight">
          <dt className="sr-only">Complete Name</dt>
          <dd className="text-sm font-semibold text-gh-fg break-words">
            {student.completeName}
          </dd>

          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0 text-xs text-gh-fg-muted">
            <div className="flex items-baseline gap-1 min-w-0">
              <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gh-fg-subtle">
                ID
              </dt>
              <dd className="font-mono text-[11px] text-gh-fg-muted">{student.id}</dd>
            </div>

            <span className="text-gh-fg-subtle select-none" aria-hidden="true">
              ·
            </span>

            <div className="flex items-baseline gap-1 min-w-0">
              <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gh-fg-subtle">
                Course
              </dt>
              <dd className="break-words">{student.course}</dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  )
}
