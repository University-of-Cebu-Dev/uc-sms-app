import { NavLink } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { getStaffEnrollmentConfig, getStaffSidebarSections } from '@/data/staffEnrollmentByRole'
import { getStaffEnrollmentTabLabel } from '@/data/identityRoles'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { cn } from '@/utils/cn'

interface StaffSidebarMenuProps {
  isCollapsed: boolean
  onReselectPeriod: () => void
  onNavigate: () => void
}

export function StaffSidebarMenu({
  isCollapsed,
  onReselectPeriod,
  onNavigate,
}: StaffSidebarMenuProps) {
  const { activeRole, activeRoleOption } = useRoleSwitcher()
  const roleConfig = getStaffEnrollmentConfig(activeRole)
  const sections = getStaffSidebarSections(activeRole)
  const roleLabel = getStaffEnrollmentTabLabel(activeRoleOption)
  const sidebarTitle = roleConfig?.sidebarTitle ?? `${roleLabel} enrollment`
  const sidebarDescription =
    roleConfig?.sidebarDescription ??
    'Manage student enrollments for the selected school period.'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!isCollapsed && (
        <div className="mx-3 mt-2 rounded-xl border border-gh-border/80 bg-gradient-to-br from-gh-accent/[0.06] via-gh-canvas to-gh-canvas px-4 py-3.5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gh-fg-muted">
            {roleLabel}
          </p>
          <p className="mt-1 text-sm font-semibold text-gh-fg">{sidebarTitle}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-gh-fg-subtle">{sidebarDescription}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Enrollment sections">
        <ul className="space-y-1">
          {sections.map(({ label, path, icon: Icon, end, description }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                onClick={onNavigate}
                title={isCollapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
                    isActive
                      ? cn(
                          'bg-gradient-to-r from-gh-accent to-gh-accent-emphasis text-gh-accent-fg shadow-md',
                          'ring-1 ring-gh-accent/20',
                        )
                      : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg hover:shadow-sm',
                    isCollapsed && 'justify-center px-2.5',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && !isCollapsed && (
                      <span
                        className="absolute bottom-2 left-0 top-2 w-1 rounded-full bg-white/80"
                        aria-hidden="true"
                      />
                    )}
                    {Icon && (
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isActive
                            ? 'bg-white/15 text-gh-accent-fg'
                            : 'bg-gh-canvas-subtle text-gh-fg-muted group-hover:bg-gh-canvas group-hover:text-gh-fg',
                          isCollapsed && 'h-9 w-9',
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                    {!isCollapsed && (
                      <span className="min-w-0 py-0.5">
                        <span className="block text-sm font-semibold leading-tight">{label}</span>
                        {description && (
                          <span
                            className={cn(
                              'mt-0.5 block text-[11px] leading-snug',
                              isActive ? 'text-gh-accent-fg/85' : 'text-gh-fg-subtle',
                            )}
                          >
                            {description}
                          </span>
                        )}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gh-border/80 px-3 py-3">
        <button
          type="button"
          onClick={onReselectPeriod}
          title={isCollapsed ? 'Reselect school period' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border border-gh-border bg-gh-canvas px-3 py-2.5',
            'text-sm font-medium text-gh-fg-muted shadow-sm transition-all duration-200',
            'hover:border-gh-accent/35 hover:bg-gh-canvas-subtle hover:text-gh-fg hover:shadow',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
            isCollapsed && 'justify-center px-2.5',
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gh-accent/10 text-gh-accent">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </span>
          {!isCollapsed && (
            <span className="text-left">
              <span className="block text-sm font-medium">Reselect school period</span>
              <span className="block text-[11px] text-gh-fg-subtle">Change active term</span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
