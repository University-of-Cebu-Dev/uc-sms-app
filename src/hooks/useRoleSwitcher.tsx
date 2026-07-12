import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { getAccessToken } from '@/lib/api'
import {
  getIdentityRoleMeta,
  isSuperAdminRole,
  normalizeIdentityRole,
  type IdentityRoleMeta,
} from '@/data/identityRoles'
import {
  getDashboardOnlyPermissions,
  portalModules,
  rolesPermissionsManage,
} from '@/data/modulePermissions'
import { rolesApi } from '@/services/roles'
import { getRolesFromToken } from '@/utils/jwt'

const STORAGE_KEY = 'uc-sms-active-role'

interface RoleSwitcherContextValue {
  activeRole: string
  activeRoleOption: IdentityRoleMeta
  availableRoles: IdentityRoleMeta[]
  canSwitchRoles: boolean
  activeRolePermissions: Set<string>
  isActiveRoleSuperAdmin: boolean
  getPermissionsForRole: (role: string) => Set<string>
  setActiveRole: (role: string) => void
}

const RoleSwitcherContext = createContext<RoleSwitcherContextValue | null>(null)

function readStoredRole(): string | null {
  const stored = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY)
  return stored ? normalizeIdentityRole(stored) : null
}

function getAssignedRoleIds(userRole?: string | null) {
  const fromToken = getRolesFromToken(getAccessToken()).map(normalizeIdentityRole)
  const unique = [...new Set(fromToken.filter(Boolean))]

  if (unique.length > 0) {
    return unique
  }

  if (userRole) {
    return [normalizeIdentityRole(userRole)]
  }

  return ['STUDENT']
}

function resolveActiveRole(assignedRoleIds: string[], userRole?: string | null) {
  const stored = readStoredRole()
  const normalizedUserRole = userRole ? normalizeIdentityRole(userRole) : null

  if (stored && assignedRoleIds.includes(stored)) {
    return stored
  }

  if (normalizedUserRole && assignedRoleIds.includes(normalizedUserRole)) {
    return normalizedUserRole
  }

  return assignedRoleIds[0] ?? 'STUDENT'
}

function getSuperAdminPermissions() {
  return new Set([
    ...portalModules.map((module) => module.accessPermission),
    rolesPermissionsManage,
  ])
}

function toPermissionSet(permissions: string[]) {
  return new Set(permissions)
}

async function loadRolePermissions(roleId: string) {
  if (isSuperAdminRole(roleId)) {
    return getSuperAdminPermissions()
  }

  try {
    const permissions = await rolesApi.getPermissions(roleId)
    return toPermissionSet(permissions)
  } catch {
    return getDashboardOnlyPermissions()
  }
}

export function RoleSwitcherProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { addToast } = useToast()

  const assignedRoleIds = useMemo(
    () => getAssignedRoleIds(user?.role),
    [user?.role],
  )

  const availableRoles = useMemo(
    () => assignedRoleIds.map(getIdentityRoleMeta),
    [assignedRoleIds],
  )

  const canSwitchRoles = assignedRoleIds.length >= 2

  const [activeRole, setActiveRoleState] = useState<string>(() =>
    resolveActiveRole(getAssignedRoleIds(user?.role), user?.role),
  )

  const [rolePermissionsByRole, setRolePermissionsByRole] = useState<Record<string, Set<string>>>(
    {},
  )

  useEffect(() => {
    if (!user) {
      setActiveRoleState('STUDENT')
      return
    }

    setActiveRoleState(resolveActiveRole(assignedRoleIds, user.role))
  }, [user, assignedRoleIds])

  useEffect(() => {
    if (!user || assignedRoleIds.length === 0) {
      setRolePermissionsByRole({})
      return
    }

    let cancelled = false

    void Promise.all(
      assignedRoleIds.map(async (roleId) => {
        const permissions = await loadRolePermissions(roleId)
        return [roleId, permissions] as const
      }),
    ).then((results) => {
      if (cancelled) return
      setRolePermissionsByRole(Object.fromEntries(results))
    })

    return () => {
      cancelled = true
    }
  }, [user, assignedRoleIds.join('|')])

  const getPermissionsForRole = useCallback(
    (role: string) => {
      const normalized = normalizeIdentityRole(role)

      if (isSuperAdminRole(normalized)) {
        return getSuperAdminPermissions()
      }

      return rolePermissionsByRole[normalized] ?? getDashboardOnlyPermissions()
    },
    [rolePermissionsByRole],
  )

  const activeRolePermissions = useMemo(
    () => getPermissionsForRole(activeRole),
    [activeRole, getPermissionsForRole],
  )

  const isActiveRoleSuperAdmin = isSuperAdminRole(activeRole)

  const setActiveRole = useCallback(
    (role: string) => {
      const normalized = normalizeIdentityRole(role)
      if (!assignedRoleIds.includes(normalized)) {
        return
      }

      setActiveRoleState(normalized)
      sessionStorage.setItem(STORAGE_KEY, normalized)

      const option = getIdentityRoleMeta(normalized)
      addToast('success', 'Role switched', `Viewing the portal as ${option.label}`)
    },
    [addToast, assignedRoleIds],
  )

  const value = useMemo(
    () => ({
      activeRole,
      activeRoleOption: getIdentityRoleMeta(activeRole),
      availableRoles,
      canSwitchRoles,
      activeRolePermissions,
      isActiveRoleSuperAdmin,
      getPermissionsForRole,
      setActiveRole,
    }),
    [
      activeRole,
      availableRoles,
      canSwitchRoles,
      activeRolePermissions,
      isActiveRoleSuperAdmin,
      getPermissionsForRole,
      setActiveRole,
    ],
  )

  return <RoleSwitcherContext.Provider value={value}>{children}</RoleSwitcherContext.Provider>
}

export function useRoleSwitcher() {
  const ctx = useContext(RoleSwitcherContext)
  if (!ctx) {
    throw new Error('useRoleSwitcher must be used within RoleSwitcherProvider')
  }
  return ctx
}
