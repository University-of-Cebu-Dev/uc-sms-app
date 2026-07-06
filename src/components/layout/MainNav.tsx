import { NavLink } from 'react-router-dom'
import { mainNavItems } from '@/data/navConfig'
import { cn } from '@/utils/cn'

export const MainNav = () => {
  return (
    <nav
      className="flex items-center justify-center gap-0.5 overflow-x-auto"
      aria-label="Main navigation"
    >
      {mainNavItems.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
              isActive
                ? 'bg-gh-canvas-subtle text-gh-fg border-b-2 border-gh-accent rounded-b-none'
                : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
            )
          }
        >
          <Icon className="hidden sm:block h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
