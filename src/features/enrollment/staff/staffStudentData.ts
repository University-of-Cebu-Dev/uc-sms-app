export type StudentEnrollmentStatus = 'pending' | 'under_review' | 'approved' | 'enrolled'

export interface StudentEnrollmentRecord {
  id: string
  studentName: string
  studentId: string
  program: string
  status: StudentEnrollmentStatus
  submittedAt: string
}

export const studentEnrollments: StudentEnrollmentRecord[] = [
  {
    id: 'se-1',
    studentName: 'Publio Sumalinog',
    studentId: '12554499',
    program: 'BSIT',
    status: 'under_review',
    submittedAt: '2026-07-06',
  },
  {
    id: 'se-2',
    studentName: 'Jane Cruz',
    studentId: '12554501',
    program: 'BSCS',
    status: 'pending',
    submittedAt: '2026-07-07',
  },
  {
    id: 'se-3',
    studentName: 'Mark Reyes',
    studentId: '12554412',
    program: 'BSIT',
    status: 'enrolled',
    submittedAt: '2026-07-01',
  },
]
