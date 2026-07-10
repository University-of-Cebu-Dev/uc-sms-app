import { EnrollmentAudiencePanel } from '@/features/enrollment/EnrollmentAudiencePanel'
import { StudentEnrollmentGuide } from '@/features/enrollment/student/StudentEnrollmentGuide'

export function StudentEnrollment() {
  return <StudentEnrollmentGuide />
}

export function ParentEnrollment() {
  return <EnrollmentAudiencePanel audience="parent" />
}
