import { apiRequest } from '@/lib/api'
import type { SchoolPeriod } from '@/types'

export type CreateSchoolPeriodPayload = Omit<SchoolPeriod, 'id'>

export type UpdateSchoolPeriodPayload = Partial<CreateSchoolPeriodPayload>

export const schoolPeriodsApi = {
  list() {
    return apiRequest<SchoolPeriod[]>('/school-periods')
  },

  create(payload: CreateSchoolPeriodPayload) {
    return apiRequest<SchoolPeriod>('/school-periods', {
      method: 'POST',
      body: payload,
    })
  },

  update(id: string, payload: UpdateSchoolPeriodPayload) {
    return apiRequest<SchoolPeriod>(`/school-periods/${id}`, {
      method: 'PATCH',
      body: payload,
    })
  },

  remove(id: string) {
    return apiRequest<void>(`/school-periods/${id}`, {
      method: 'DELETE',
    })
  },
}
