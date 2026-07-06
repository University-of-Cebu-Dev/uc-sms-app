import type { StudentTypeId } from '@/types'

export const STUDENT_TYPES: { id: StudentTypeId; label: string }[] = [
  { id: 'new-student', label: 'New Student' },
  { id: 'old-student', label: 'Old Student' },
  { id: 'shiftee', label: 'Shiftee' },
  { id: 'cross-enrollee', label: 'Cross Enrollee' },
  { id: 'returnee', label: 'Returnee' },
  { id: 'transferee', label: 'Transferee' },
]

export const ALL_STUDENT_TYPE_IDS = STUDENT_TYPES.map((type) => type.id)

export const getStudentTypeLabel = (id: StudentTypeId) =>
  STUDENT_TYPES.find((type) => type.id === id)?.label ?? id
