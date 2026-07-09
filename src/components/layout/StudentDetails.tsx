import { useAuth } from '@/hooks/useAuth'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { RoleSwitcher } from '@/components/layout/RoleSwitcher'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'
import { formatUserDisplayName } from '@/utils/format'

interface StudentDetailsProps {
  isCollapsed: boolean
}

export const StudentDetails = ({ isCollapsed }: StudentDetailsProps) => {
  const { user, student } = useAuth()
  const { activeRoleOption } = useRoleSwitcher()

  if (!user) return null

  const displayName = formatUserDisplayName(user)
  const idNumber = user.idNumber || student?.id || ''
  const showCourse = activeRoleOption.id === 'STUDENT' && Boolean(student?.course)

  if (isCollapsed) {
    return (
      <section
        className="border-b border-gh-border py-3"
        aria-label="User profile"
      >
        <div className="flex items-center justify-center gap-2 px-2">
          <Avatar
            src={user.avatar}
            alt={displayName}
            size="sm"
            className={cn('ring-2', activeRoleOption.accentRing)}
          />
          <RoleSwitcher isCollapsed />
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative overflow-visible border-b border-gh-border bg-gradient-to-b from-gh-canvas-subtle/60 to-transparent px-4 py-3.5"
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

          {idNumber ? (
            <p className="mt-1 text-xs text-gh-fg-muted">
              <span className="text-[10px] font-medium uppercase tracking-wide text-gh-fg-subtle">
                ID
              </span>{' '}
              <span className="font-mono text-[11px]">{idNumber}</span>
            </p>
          ) : null}

          {showCourse ? (
            <p className="mt-1 text-xs text-gh-fg-muted break-words">{student?.course}</p>
          ) : null}
        </div>

        <RoleSwitcher className="self-start" />
      </div>
    </section>
  )
}
