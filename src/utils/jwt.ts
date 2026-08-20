export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)

    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function extractClaimValues(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key]
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string')
    }
    if (typeof value === 'string' && value.length > 0) {
      return [value]
    }
  }

  return []
}

export function getRolesFromToken(token: string | null) {
  if (!token) return []

  const payload = parseJwtPayload(token)
  if (!payload) return []

  return extractClaimValues(
    payload,
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  )
}

export function getPermissionsFromToken(token: string | null) {
  if (!token) return []

  const payload = parseJwtPayload(token)
  if (!payload) return []

  return extractClaimValues(payload, 'permission', 'permissions')
}

// UCIdentityService is shared across every ecosystem app -- a successful login only
// proves the credentials are valid, not that the account has any business in this
// app specifically. See UCIdentityService/docs/APP_ENROLLMENT_GUIDE.md's "Reject
// logins from accounts with no access to your app" section.
export function hasAccessToThisApp(token: string, appPrefix = 'UCSMS'): boolean {
  const roles = getRolesFromToken(token).map((role) => role.toUpperCase())
  if (roles.includes('SUPERADMIN') || roles.includes('ADMIN')) return true

  const permissions = getPermissionsFromToken(token)
  return permissions.some((permission) => permission.startsWith(`${appPrefix}.`))
}
