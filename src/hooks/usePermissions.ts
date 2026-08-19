import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { isUcsmsAdminRole } from '@/data/identityRoles'
import { canAccessPath, getAccessibleModules } from '@/utils/moduleAccess'

export function usePermissions() {
  const { isAuthenticated } = useAuth()
  const { activeRole, activeRolePermissions, isActiveRoleSuperAdmin } = useRoleSwitcher()

  return useMemo(() => {
    const permissions = activeRolePermissions
    const isUcsmsAdmin = isUcsmsAdminRole(activeRole)

    return {
      roles: [activeRole],
      permissions,
      isSuperAdmin: isActiveRoleSuperAdmin,
      isUcsmsAdmin,
      accessibleModules: getAccessibleModules(permissions, isActiveRoleSuperAdmin),
      canAccessPath: (pathname: string) =>
        isAuthenticated &&
        canAccessPath(pathname, permissions, isActiveRoleSuperAdmin, isUcsmsAdmin),
      hasPermission: (permission: string) =>
        isActiveRoleSuperAdmin || permissions.has(permission),
    }
  }, [isAuthenticated, activeRole, activeRolePermissions, isActiveRoleSuperAdmin])
}
