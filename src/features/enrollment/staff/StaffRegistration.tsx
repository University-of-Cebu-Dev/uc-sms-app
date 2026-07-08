import { ClipboardList } from 'lucide-react'
import { StaffUnderConstruction } from '@/features/enrollment/staff/StaffUnderConstruction'

export function StaffRegistration() {
  return (
    <StaffUnderConstruction
      icon={ClipboardList}
      title="Registration"
      description="Register and manage student enrollment records for the selected school period."
    />
  )
}
