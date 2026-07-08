import { SlidersHorizontal } from 'lucide-react'
import { StaffUnderConstruction } from '@/features/enrollment/staff/StaffUnderConstruction'

export function StaffAdjustments() {
  return (
    <StaffUnderConstruction
      icon={SlidersHorizontal}
      title="Adjustments"
      description="Process enrollment adjustments such as add, drop, and schedule changes."
    />
  )
}
