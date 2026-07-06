import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { SidebarProvider } from '@/hooks/useSidebar'
import { SchoolPeriodProvider } from '@/hooks/useSchoolPeriod'
import { NotificationsProvider } from '@/hooks/useNotifications'

export function DashboardLayout() {
  return (
    <SchoolPeriodProvider>
      <NotificationsProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-gh-canvas-subtle">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </NotificationsProvider>
    </SchoolPeriodProvider>
  )
}
