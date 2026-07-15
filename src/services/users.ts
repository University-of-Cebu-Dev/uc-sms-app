import { apiRequest } from '@/lib/api'

export interface UserPreferences {
  selectedPeriodId: string | null
}

export const usersApi = {
  getPreferences() {
    return apiRequest<UserPreferences>('/users/me/preferences')
  },

  updatePreferences(payload: Partial<UserPreferences>) {
    return apiRequest<UserPreferences>('/users/me/preferences', {
      method: 'PATCH',
      body: payload,
    })
  },
}
