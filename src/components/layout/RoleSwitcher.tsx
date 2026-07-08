import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown, Sparkles } from 'lucide-react'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { getIdentityRoleMeta } from '@/data/identityRoles'
import { cn } from '@/utils/cn'

interface RoleSwitcherProps {
  isCollapsed?: boolean
}

export function RoleSwitcher({ isCollapsed = false }: RoleSwitcherProps) {
  const { activeRole, activeRoleOption, availableRoles, setActiveRole } = useRoleSwitcher()
  const navigate = useNavigate()
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
    if (role !== activeRole) {
      setActiveRole(role)
      const option = getIdentityRoleMeta(role)
      if (option.enrollmentPath) {
        navigate(option.enrollmentPath)
      }
    }
    setOpen(false)
  }

  if (isCollapsed) {
    return (
      <div ref={containerRef} className="relative px-2 pb-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'mx-auto flex h-9 w-9 items-center justify-center rounded-full transition-all',
            activeRoleOption.accentBg,
            activeRoleOption.accentRing,
            'ring-1 hover:scale-105 hover:shadow-sm',
          )}
          aria-label={`Switch role, currently ${activeRoleOption.label}`}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <ActiveIcon className={cn('h-4 w-4', activeRoleOption.accent)} aria-hidden="true" />
        </button>

        {open && (
          <RoleMenu
            align="left"
            className="left-full top-0 ml-2"
            activeRole={activeRole}
            availableRoles={availableRoles}
            onSelect={handleSelect}
          />
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative mt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all',
          'border-gh-border/80 bg-gradient-to-br from-gh-canvas via-gh-canvas to-gh-canvas-subtle',
          'hover:border-gh-accent/30 hover:shadow-sm',
          open && 'border-gh-accent/40 shadow-md ring-2 ring-gh-accent/10',
        )}
        aria-label={`Switch role, currently ${activeRoleOption.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1',
            activeRoleOption.accentBg,
            activeRoleOption.accentRing,
          )}
        >
          <ActiveIcon className={cn('h-4 w-4', activeRoleOption.accent)} aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gh-fg-subtle">
              Active role
            </span>
            <Sparkles className="h-3 w-3 text-gh-accent/70" aria-hidden="true" />
          </span>
          <span className="block truncate text-sm font-semibold text-gh-fg">
            {activeRoleOption.label}
          </span>
        </span>

        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-gh-fg-muted transition-transform duration-200',
            open && 'rotate-180 text-gh-accent',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <RoleMenu
          activeRole={activeRole}
          availableRoles={availableRoles}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}

interface RoleMenuProps {
  activeRole: string
  availableRoles: ReturnType<typeof useRoleSwitcher>['availableRoles']
  onSelect: (role: string) => void
  align?: 'left' | 'right'
  className?: string
}

function RoleMenu({ activeRole, availableRoles, onSelect, align = 'right', className }: RoleMenuProps) {
  return (
    <div
      className={cn(
        'absolute z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gh-border',
        'bg-gh-canvas/95 shadow-xl backdrop-blur-md animate-fade-in',
        align === 'right' ? 'right-0' : 'left-0',
        className,
      )}
      role="listbox"
      aria-label="Switch portal role"
    >
      <div className="border-b border-gh-border bg-gh-canvas-subtle/80 px-3 py-2.5">
        <p className="text-xs font-semibold text-gh-fg">Switch role</p>
        <p className="text-[11px] text-gh-fg-muted">Preview the portal from another perspective</p>
      </div>

      <ul className="p-1.5">
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
                  'flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors',
                  isActive
                    ? 'bg-gh-accent/8 ring-1 ring-gh-accent/20'
                    : 'hover:bg-gh-canvas-subtle',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1',
                    role.accentBg,
                    role.accentRing,
                  )}
                >
                  <Icon className={cn('h-4 w-4', role.accent)} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gh-fg">{role.label}</span>
                    {isActive && (
                      <Check className="h-4 w-4 shrink-0 text-gh-accent" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-gh-fg-muted">
                    {role.description}
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
