import { identityRequest } from '@/lib/api'

export interface RoleRecord {
  id: string
  name: string
  permissions: string[]
}

export const rolesApi = {
  list() {
    return identityRequest<RoleRecord[]>('/role', { auth: true })
  },

  getPermissions(roleName: string) {
    return identityRequest<string[]>(`/role/${encodeURIComponent(roleName)}/permissions`, {
      auth: true,
    })
  },

  updatePermissions(roleName: string, permissions: string[]) {
    return identityRequest<RoleRecord>(`/role/${encodeURIComponent(roleName)}/permissions`, {
      method: 'PUT',
      body: { permissions },
      auth: true,
    })
  },

  listAllPermissions() {
    return identityRequest<string[]>('/permission', { auth: true })
  },
}
