import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { getIdentityRoleMeta, normalizeIdentityRole } from '@/data/identityRoles'
import { isSuperAdminRole } from '@/data/rolePermissionDefaults'
import { canAccessPath } from '@/utils/moduleAccess'
import { cn } from '@/utils/cn'

interface RoleSwitcherProps {
  isCollapsed?: boolean
  className?: string
}

export function RoleSwitcher({ isCollapsed = false, className }: RoleSwitcherProps) {
  const { activeRole, activeRoleOption, availableRoles, canSwitchRoles, getPermissionsForRole, setActiveRole } =
    useRoleSwitcher()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const ActiveIcon = activeRoleOption.icon

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSelect = (role: string) => {
    const normalized = normalizeIdentityRole(role)
    if (normalized !== activeRole) {
      setActiveRole(role)
      const option = getIdentityRoleMeta(role)
      const permissions = getPermissionsForRole(normalized)
      const isSuperAdmin = isSuperAdminRole(normalized)

      let nextPath = pathname
      if (option.enrollmentPath && pathname.startsWith('/enrollment')) {
        nextPath = option.enrollmentPath
      } else if (!canAccessPath(pathname, permissions, isSuperAdmin)) {
        nextPath = '/dashboard'
      }

      if (nextPath !== pathname) {
        navigate(nextPath, { replace: true })
      }
    }
    setOpen(false)
  }

  if (!canSwitchRoles) {
    return null
  }

  return (
    <div ref={containerRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center justify-center rounded-lg border transition-all',
          'border-gh-border/80 bg-gh-canvas/80 hover:border-gh-accent/35 hover:bg-gh-canvas-subtle hover:shadow-sm',
          open && 'border-gh-accent/40 bg-gh-canvas-subtle shadow-sm ring-2 ring-gh-accent/15',
          isCollapsed ? 'h-7 w-7' : 'h-8 w-8',
        )}
        title={`Switch role (${activeRoleOption.label})`}
        aria-label={`Switch role, currently ${activeRoleOption.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ActiveIcon
          className={cn(isCollapsed ? 'h-3.5 w-3.5' : 'h-4 w-4', activeRoleOption.accent)}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <RoleMenu
          activeRole={activeRole}
          availableRoles={availableRoles}
          onSelect={handleSelect}
        />
      ) : null}
    </div>
  )
}

interface RoleMenuProps {
  activeRole: string
  availableRoles: ReturnType<typeof useRoleSwitcher>['availableRoles']
  onSelect: (role: string) => void
}

function RoleMenu({ activeRole, availableRoles, onSelect }: RoleMenuProps) {
  return (
    <div
      className={cn(
        'absolute left-full top-0 z-50 ml-2 w-64 overflow-hidden rounded-xl border border-gh-popover-border',
        'bg-gh-popover shadow-xl animate-fade-in',
      )}
      role="listbox"
      aria-label="Switch portal role"
    >
      <div className="border-b border-gh-popover-border bg-gh-popover-subtle px-3 py-2">
        <p className="text-xs font-semibold text-gh-popover-fg">Switch role</p>
      </div>

      <ul className="max-h-72 overflow-y-auto p-1.5">
        {availableRoles.map((role) => {
          const Icon = role.icon
          const isActive = role.id === activeRole

          return (
            <li key={role.id}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => onSelect(role.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors',
                  isActive
                    ? 'bg-gh-popover-accent/10 ring-1 ring-gh-popover-accent/25'
                    : 'hover:bg-gh-popover-subtle',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1',
                    role.accentBg,
                    role.accentRing,
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', role.accent)} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gh-popover-fg">
                      {role.label}
                    </span>
                    {isActive ? (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-gh-popover-accent"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
