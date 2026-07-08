import { NavLink } from 'react-router-dom'
import { enrollmentTabs } from '@/data/navConfig'
import { cn } from '@/utils/cn'

export function EnrollmentTabs() {
  return (
    <div className="border-t border-gh-border bg-gh-canvas-subtle/50 px-4 py-2">
      <nav
        className="inline-flex gap-1 rounded-lg border border-gh-border bg-gh-canvas p-1"
        aria-label="Enrollment audience"
      >
        {enrollmentTabs.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:gap-2 sm:px-4 sm:text-sm',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
                isActive
                  ? 'bg-gh-accent text-gh-accent-fg shadow-sm'
                  : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
              )
            }
          >
            <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
