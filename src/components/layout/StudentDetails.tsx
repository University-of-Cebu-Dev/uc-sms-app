import { useAuth } from '@/hooks/useAuth'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { RoleSwitcher } from '@/components/layout/RoleSwitcher'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

interface StudentDetailsProps {
  isCollapsed: boolean
}

export const StudentDetails = ({ isCollapsed }: StudentDetailsProps) => {
  const { user, student } = useAuth()
  const { activeRoleOption } = useRoleSwitcher()

  if (!user) return null

  const displayName = student?.completeName || user.name
  const showStudentMeta = activeRoleOption.id === 'STUDENT' && student

  if (isCollapsed) {
    return (
      <section
        className="border-b border-gh-border py-3"
        aria-label="User profile"
      >
        <div className="flex justify-center">
          <div className="relative">
            <Avatar
              src={user.avatar}
              alt={displayName}
              size="sm"
              className={cn('ring-2', activeRoleOption.accentRing)}
            />
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-gh-sidebar',
                activeRoleOption.accentBg,
              )}
              aria-hidden="true"
            />
          </div>
        </div>
        <RoleSwitcher isCollapsed />
      </section>
    )
  }

  return (
    <section
      className="relative border-b border-gh-border bg-gradient-to-b from-gh-canvas-subtle/60 to-transparent px-4 py-3.5"
      aria-label="User profile"
    >
      <div
        className={cn(
          'absolute left-0 top-3 bottom-3 w-1 rounded-full',
          activeRoleOption.accentBg,
        )}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 min-w-0">
        <Avatar
          src={user.avatar}
          alt={displayName}
          size="md"
          className={cn('shrink-0 ring-2 shadow-sm', activeRoleOption.accentRing)}
        />

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gh-fg-subtle">
            Signed in as
          </p>
          <h2 className="text-sm font-semibold text-gh-fg break-words leading-snug">
            {displayName}
          </h2>

          {showStudentMeta ? (
            <dl className="mt-1.5 space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0 text-xs text-gh-fg-muted">
                <div className="flex items-baseline gap-1 min-w-0">
                  <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gh-fg-subtle">
                    ID
                  </dt>
                  <dd className="font-mono text-[11px] text-gh-fg-muted">{student.id}</dd>
                </div>

                {student.course ? (
                  <>
                    <span className="text-gh-fg-subtle select-none" aria-hidden="true">
                      ·
                    </span>
                    <div className="flex items-baseline gap-1 min-w-0">
                      <dt className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-gh-fg-subtle">
                        Course
                      </dt>
                      <dd className="break-words">{student.course}</dd>
                    </div>
                  </>
                ) : null}
              </div>
            </dl>
          ) : (
            <p className="mt-1 text-xs text-gh-fg-muted truncate">{user.email}</p>
          )}
        </div>
      </div>

      <RoleSwitcher />
    </section>
  )
}
