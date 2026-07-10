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
  normalizeIdentityRole,
  type IdentityRoleMeta,
} from '@/data/identityRoles'
import { getRolesFromToken } from '@/utils/jwt'

const STORAGE_KEY = 'uc-sms-active-role'

interface RoleSwitcherContextValue {
  activeRole: string
  activeRoleOption: IdentityRoleMeta
  availableRoles: IdentityRoleMeta[]
  canSwitchRoles: boolean
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

  useEffect(() => {
    if (!user) {
      setActiveRoleState('STUDENT')
      return
    }

    setActiveRoleState(resolveActiveRole(assignedRoleIds, user.role))
  }, [user, assignedRoleIds])

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
      setActiveRole,
    }),
    [activeRole, availableRoles, canSwitchRoles, setActiveRole],
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
