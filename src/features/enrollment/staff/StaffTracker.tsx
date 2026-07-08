import { Route } from 'lucide-react'
import { StaffUnderConstruction } from '@/features/enrollment/staff/StaffUnderConstruction'

export function StaffTracker() {
  return (
    <StaffUnderConstruction
      icon={Route}
      title="Tracker"
      description="Track student enrollment status and progress across workflow steps."
    />
  )
}
