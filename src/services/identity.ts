import { identityRequest } from '@/lib/api'

export interface IdentityLoginRequest {
  identifier: string
  password: string
  device?: string
}

export interface IdentityAuthResponse {
  accessToken: string
  refreshToken: string
}

export const identityApi = {
  login(identifier: string, password: string) {
    return identityRequest<IdentityAuthResponse>('/auth/login', {
      method: 'POST',
      body: {
        identifier,
        password,
        device: 'UC SMS Web Portal',
      },
    })
  },

  logout(refreshToken: string) {
    return identityRequest<void>('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
    })
  },

  refresh(refreshToken: string) {
    return identityRequest<IdentityAuthResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    })
  },
}
