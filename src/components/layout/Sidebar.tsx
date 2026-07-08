import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  ArrowLeft,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSidebar } from '@/hooks/useSidebar'
import { useSchoolPeriod } from '@/hooks/useSchoolPeriod'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/hooks/useAuth'
import { SchoolPeriodItem } from '@/components/layout/SchoolPeriodItem'
import { StudentDetails } from '@/components/layout/StudentDetails'
import { AppBrand } from '@/components/common/AppBrand'
import { StaffSidebarMenu } from '@/features/enrollment/staff/StaffSidebarMenu'
import { cn } from '@/utils/cn'

type StaffSidebarView = 'menu' | 'periods'

export const Sidebar = () => {
  const { isOpen, isCollapsed, close, toggleCollapse } = useSidebar()
  const { periods, selectedPeriodId, setSelectedPeriodId } = useSchoolPeriod()
  const { addToast } = useToast()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isStaffEnrollment = pathname.startsWith('/enrollment/staff')
  const [staffSidebarView, setStaffSidebarView] = useState<StaffSidebarView>('menu')

  useEffect(() => {
    if (!isStaffEnrollment) {
      setStaffSidebarView('menu')
    }
  }, [isStaffEnrollment])

  const showStaffMenu = isStaffEnrollment && staffSidebarView === 'menu'
  const showPeriodPicker = !isStaffEnrollment || staffSidebarView === 'periods'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSelectPeriod = (id: string) => {
    if (id === selectedPeriodId) {
      if (isStaffEnrollment) {
        setStaffSidebarView('menu')
        close()
      }
      return
    }

    void setSelectedPeriodId(id)
    const period = periods.find((p) => p.id === id)
    if (period) {
      addToast('info', 'School period changed', `Now viewing ${period.name}`)
    }

    if (isStaffEnrollment) {
      setStaffSidebarView('menu')
    }

    close()
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex items-center border-b border-gh-border px-4 h-14 shrink-0',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && <AppBrand titleClassName="text-sm" />}
        {isCollapsed && <AppBrand showTitle={false} logoClassName="h-7" />}
        <button
          type="button"
          onClick={close}
          className="lg:hidden p-1 rounded-md hover:bg-gh-canvas-subtle text-gh-fg-muted"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <StudentDetails isCollapsed={isCollapsed} />

      {showStaffMenu && (
        <StaffSidebarMenu
          isCollapsed={isCollapsed}
          onReselectPeriod={() => setStaffSidebarView('periods')}
          onNavigate={close}
        />
      )}

      {showPeriodPicker && (
        <>
          {!isCollapsed && (
            <div className="px-4 py-3 border-b border-gh-border">
              {isStaffEnrollment ? (
                <button
                  type="button"
                  onClick={() => setStaffSidebarView('menu')}
                  className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gh-accent hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to enrollment menu
                </button>
              ) : null}
              <p className="text-xs font-semibold text-gh-fg-muted uppercase tracking-wider">
                School Periods
              </p>
              <p className="text-[11px] text-gh-fg-subtle mt-0.5">
                {isStaffEnrollment
                  ? 'Choose a period for staff enrollment'
                  : 'Select a period to enroll'}
              </p>
            </div>
          )}

          <nav
            className="flex-1 overflow-y-auto py-2 px-2 space-y-2"
            aria-label="School periods"
            role="listbox"
            aria-activedescendant={`period-${selectedPeriodId}`}
          >
            {periods.map((period) => (
              <div
                key={period.id}
                id={`period-${period.id}`}
                role="option"
                aria-selected={selectedPeriodId === period.id}
              >
                <SchoolPeriodItem
                  period={period}
                  isSelected={selectedPeriodId === period.id}
                  isCollapsed={isCollapsed}
                  onSelect={handleSelectPeriod}
                />
              </div>
            ))}
          </nav>
        </>
      )}

      <div className="border-t border-gh-border py-3 px-2 space-y-0.5 shrink-0">
        <NavLink
          to="/settings"
          onClick={close}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
              isActive
                ? 'bg-gh-canvas-subtle text-gh-fg'
                : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
              isCollapsed && 'justify-center px-2',
            )
          }
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
        <NavLink
          to="/profile"
          onClick={close}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
              isActive
                ? 'bg-gh-canvas-subtle text-gh-fg'
                : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
              isCollapsed && 'justify-center px-2',
            )
          }
          title={isCollapsed ? 'Profile' : undefined}
        >
          <User className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
            'text-gh-fg-muted hover:bg-gh-danger-subtle hover:text-gh-danger transition-colors duration-150',
            isCollapsed && 'justify-center px-2',
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        type="button"
        onClick={toggleCollapse}
        className="hidden lg:flex items-center justify-center border-t border-gh-border py-3 text-gh-fg-muted hover:text-gh-fg hover:bg-gh-canvas-subtle transition-colors shrink-0"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  )

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-gh-sidebar border-r border-gh-border transition-all duration-300',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-80',
        )}
        aria-label={showStaffMenu ? 'Enrollment sidebar' : 'School periods sidebar'}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
