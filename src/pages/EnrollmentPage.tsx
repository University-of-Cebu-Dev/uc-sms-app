import { Outlet, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import {
  getAllStaffSectionLabelsByPath,
  STAFF_OVERVIEW_PATH,
} from '@/data/staffEnrollmentByRole'
import { getStaffEnrollmentTabLabel } from '@/data/identityRoles'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'

const staffSectionByPath = getAllStaffSectionLabelsByPath()

export function EnrollmentPage() {
  const { pathname } = useLocation()
  const { activeRoleOption } = useRoleSwitcher()
  const isStaff = pathname.startsWith('/enrollment/staff')
  const isStaffOverview = pathname === STAFF_OVERVIEW_PATH
  const staffSectionTitle = staffSectionByPath[pathname]
  const staffTabLabel = getStaffEnrollmentTabLabel(activeRoleOption)

  const pageTitle =
    isStaff && isStaffOverview
      ? `Overview`
      : isStaff && staffSectionTitle
        ? staffSectionTitle
        : 'Enrollment'

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <PageHeader
        title={pageTitle}
        description={
          isStaff
            ? 'Review and manage student enrollments for the selected school period.'
            : 'Manage enrollment by audience for the selected school period.'
        }
        breadcrumbs={
          isStaff
            ? [
                { label: 'Enrollment', path: STAFF_OVERVIEW_PATH },
                { label: staffTabLabel, path: STAFF_OVERVIEW_PATH },
                ...(staffSectionTitle && !isStaffOverview ? [{ label: staffSectionTitle }] : []),
              ]
            : [{ label: 'Enrollment' }]
        }
      />

      <Outlet />
    </div>
  )
}
