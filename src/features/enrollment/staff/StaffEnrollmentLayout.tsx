import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isStaffSectionAllowedForRole, STAFF_OVERVIEW_PATH } from '@/data/staffEnrollmentByRole'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'

export function StaffEnrollmentLayout() {
  const { pathname } = useLocation()
  const { activeRole } = useRoleSwitcher()

  if (!isStaffSectionAllowedForRole(pathname, activeRole)) {
    return <Navigate to={STAFF_OVERVIEW_PATH} replace />
  }

  return <Outlet />
}
