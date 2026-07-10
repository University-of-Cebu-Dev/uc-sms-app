import { useMemo } from 'react'
import { getAccessToken } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { getPermissionsFromToken, getRolesFromToken } from '@/utils/jwt'
import { canAccessPath, getAccessibleModules } from '@/utils/moduleAccess'

export function usePermissions() {
  const { isAuthenticated } = useAuth()

  return useMemo(() => {
    const token = getAccessToken()
    const roles = getRolesFromToken(token)
    const permissions = new Set(getPermissionsFromToken(token))
    const isSuperAdmin = roles.some((role) => role.toLowerCase() === 'superadmin')

    return {
      roles,
      permissions,
      isSuperAdmin,
      accessibleModules: getAccessibleModules(permissions, isSuperAdmin),
      canAccessPath: (pathname: string) =>
        isAuthenticated && canAccessPath(pathname, permissions, isSuperAdmin),
      hasPermission: (permission: string) => isSuperAdmin || permissions.has(permission),
    }
  }, [isAuthenticated])
}
