import { useLocation } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import { staffSectionPageMetaByPath } from '@/data/staffEnrollmentByRole'
import { StaffUnderConstruction } from '@/features/enrollment/staff/StaffUnderConstruction'
import { StaffEmptyState } from '@/features/enrollment/staff/staffUi'

export function StaffSectionPlaceholder() {
  const { pathname } = useLocation()
  const meta = staffSectionPageMetaByPath[pathname]

  if (!meta) {
    return (
      <StaffEmptyState
        icon={CircleAlert}
        title="Section unavailable"
        description="This enrollment section is not configured yet."
      />
    )
  }

  return <StaffUnderConstruction icon={meta.icon} title={meta.title} description={meta.description} />
}
