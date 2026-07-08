import { BookOpen } from 'lucide-react'
import { StaffUnderConstruction } from '@/features/enrollment/staff/StaffUnderConstruction'

export function StaffEnrolledSubjects() {
  return (
    <StaffUnderConstruction
      icon={BookOpen}
      title="Enrolled Subjects"
      description="View and manage subjects enrolled by students for the active term."
    />
  )
}
