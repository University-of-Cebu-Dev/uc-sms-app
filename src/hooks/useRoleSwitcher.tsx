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
import {
  getIdentityRoleMeta,
  identityRoleCatalog,
  normalizeIdentityRole,
  type IdentityRoleMeta,
} from '@/data/identityRoles'

const STORAGE_KEY = 'uc-sms-active-role'

interface RoleSwitcherContextValue {
  activeRole: string
  activeRoleOption: IdentityRoleMeta
  availableRoles: IdentityRoleMeta[]
  setActiveRole: (role: string) => void
}

const RoleSwitcherContext = createContext<RoleSwitcherContextValue | null>(null)

function readStoredRole(): string | null {
  const stored = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY)
  return stored ? normalizeIdentityRole(stored) : null
}

export function RoleSwitcherProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [activeRole, setActiveRoleState] = useState<string>(() => {
    return readStoredRole() ?? normalizeIdentityRole(user?.role)
  })

  useEffect(() => {
    if (!user) {
      setActiveRoleState('STUDENT')
      return
    }

    const stored = readStoredRole()
    if (!stored) {
      setActiveRoleState(normalizeIdentityRole(user.role))
    }
  }, [user])

  const availableRoles = useMemo(() => identityRoleCatalog, [])

  const setActiveRole = useCallback(
    (role: string) => {
      const normalized = normalizeIdentityRole(role)
      setActiveRoleState(normalized)
      sessionStorage.setItem(STORAGE_KEY, normalized)

      const option = getIdentityRoleMeta(normalized)
      addToast('success', 'Role switched', `Viewing the portal as ${option.label}`)
    },
    [addToast],
  )

  const value = useMemo(
    () => ({
      activeRole,
      activeRoleOption: getIdentityRoleMeta(activeRole),
      availableRoles,
      setActiveRole,
    }),
    [activeRole, availableRoles, setActiveRole],
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
