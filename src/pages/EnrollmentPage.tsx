import { Outlet, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { staffEnrollmentSections } from '@/data/navConfig'

const staffSectionByPath = Object.fromEntries(
  staffEnrollmentSections.map((section) => [section.path, section.label]),
)

export function EnrollmentPage() {
  const { pathname } = useLocation()
  const isStaff = pathname.startsWith('/enrollment/staff')
  const staffSectionTitle = staffSectionByPath[pathname]

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <PageHeader
        title={isStaff && staffSectionTitle ? staffSectionTitle : 'Enrollment'}
        description={
          isStaff
            ? 'Review and manage student enrollments for the selected school period.'
            : 'Manage enrollment by audience for the selected school period.'
        }
        breadcrumbs={
          isStaff
            ? [
                { label: 'Enrollment', path: '/enrollment/staff/registration' },
                { label: 'Staff', path: '/enrollment/staff/registration' },
                ...(staffSectionTitle ? [{ label: staffSectionTitle }] : []),
              ]
            : [{ label: 'Enrollment' }]
        }
      />

      <Outlet />
    </div>
  )
}
