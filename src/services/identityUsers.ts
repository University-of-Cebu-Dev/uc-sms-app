import { identityRequest } from '@/lib/api'

export interface IdentityUserAccount {
  id: string
  username: string
  email: string
  idNumber: string
  firstName: string
  lastName: string
  middleName: string
  isActive: boolean
  dateResigned: string | null
  roles: string[]
}

export interface UpdateAccountPayload {
  email: string
  idNumber: string
  firstName: string
  lastName: string
  middleName: string
  isActive: boolean
  dateResigned: string | null
  roles: string[]
}

export interface CreateStaffAccountPayload {
  username: string
  email: string
  idNumber: string
  firstName: string
  lastName: string
  middleName: string
  password: string
  roles: string[]
}

export function formatAccountName(account: Pick<IdentityUserAccount, 'firstName' | 'middleName' | 'lastName'>) {
  const name = [account.firstName, account.middleName, account.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ')

  return name || '—'
}

export const identityUsersApi = {
  listStaff() {
    return identityRequest<IdentityUserAccount[]>('/user/staff', { auth: true })
  },

  updateAccount(userId: string, payload: UpdateAccountPayload) {
    return identityRequest<IdentityUserAccount>(`/user/${userId}/account`, {
      method: 'PUT',
      body: {
        email: payload.email,
        idNumber: payload.idNumber,
        firstName: payload.firstName,
        lastName: payload.lastName,
        middleName: payload.middleName,
        isActive: payload.isActive,
        dateResigned: payload.dateResigned,
        roles: payload.roles,
      },
      auth: true,
    })
  },

  createStaff(payload: CreateStaffAccountPayload) {
    return identityRequest<IdentityUserAccount>('/user', {
      method: 'POST',
      body: payload,
      auth: true,
    })
  },

  // Endpoint names are fixed by UCIdentityService's SystemRoles.Admin ("Admin") --
  // displayed as "SMSAdmin" in the UI, but the wire contract stays "admin".
  promoteToAdmin(userId: string) {
    return identityRequest<{ message: string }>(`/user/${userId}/promote-admin`, {
      method: 'POST',
      auth: true,
    })
  },

  demoteFromAdmin(userId: string) {
    return identityRequest<{ message: string }>(`/user/${userId}/demote-admin`, {
      method: 'POST',
      auth: true,
    })
  },
}
