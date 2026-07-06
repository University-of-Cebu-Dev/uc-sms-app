import { apiRequest } from '@/lib/api'
import type { ProgramEnrollment } from '@/types'

export type UpdateProgramEnrollmentPayload = Partial<
  Pick<ProgramEnrollment, 'isActive' | 'openForEnroll'>
>

export const programsApi = {
  list(schoolPeriodId: string) {
    return apiRequest<ProgramEnrollment[]>(`/school-periods/${schoolPeriodId}/programs`)
  },

  update(schoolPeriodId: string, programId: number, payload: UpdateProgramEnrollmentPayload) {
    return apiRequest<ProgramEnrollment>(
      `/school-periods/${schoolPeriodId}/programs/${programId}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  },
}
