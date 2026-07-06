import { Bell, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useSidebar } from '@/hooks/useSidebar'
import { useNotifications } from '@/hooks/useNotifications'
import { Badge } from '@/components/ui/Badge'
import { MainNav } from '@/components/layout/MainNav'
import { SettingsTabs } from '@/features/settings/SettingsTabs'

export const Navbar = () => {
  const { toggle } = useSidebar()
  const { pathname } = useLocation()
  const { unreadCount } = useNotifications()
  const isSettings = pathname.startsWith('/settings')

  return (
    <header className="sticky top-0 z-30 border-b border-gh-border bg-gh-canvas">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={toggle}
          className="lg:hidden p-2 rounded-md hover:bg-gh-canvas-subtle text-gh-fg-muted transition-colors"
          aria-label="Open school periods menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 flex justify-center min-w-0 px-2">
          <MainNav />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="relative p-2 rounded-md hover:bg-gh-canvas-subtle text-gh-fg-muted transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="danger"
                className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {isSettings && <SettingsTabs />}
    </header>
  )
}
