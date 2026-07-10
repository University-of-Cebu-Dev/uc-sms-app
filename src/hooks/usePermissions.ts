import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { canAccessPath, getAccessibleModules } from '@/utils/moduleAccess'

export function usePermissions() {
  const { isAuthenticated } = useAuth()
  const { activeRole, activeRolePermissions, isActiveRoleSuperAdmin } = useRoleSwitcher()

  return useMemo(() => {
    const permissions = activeRolePermissions

    return {
      roles: [activeRole],
      permissions,
      isSuperAdmin: isActiveRoleSuperAdmin,
      accessibleModules: getAccessibleModules(permissions, isActiveRoleSuperAdmin),
      canAccessPath: (pathname: string) =>
        isAuthenticated && canAccessPath(pathname, permissions, isActiveRoleSuperAdmin),
      hasPermission: (permission: string) =>
        isActiveRoleSuperAdmin || permissions.has(permission),
    }
  }, [isAuthenticated, activeRole, activeRolePermissions, isActiveRoleSuperAdmin])
}
