import { apiRequest, clearTokens, getRefreshToken } from '@/lib/api'
import { identityApi } from '@/services/identity'
import type { Student, User } from '@/types'

export interface AuthMeResponse {
  user: User
  student: Student | null
  preferences: {
    selectedPeriodId: string | null
  }
}

export const authApi = {
  async login(identifier: string, password: string, rememberMe: boolean) {
    const tokens = await identityApi.login(identifier, password)
    return { ...tokens, rememberMe }
  },

  me() {
    return apiRequest<AuthMeResponse>('/auth/me')
  },

  async logout() {
    const refreshToken = getRefreshToken()
    clearTokens()

    if (refreshToken) {
      await identityApi.logout(refreshToken).catch(() => undefined)
    }
  },
}
