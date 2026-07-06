import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '@/services/auth'
import { setTokens, getAccessToken, clearTokens } from '@/lib/api'
import { getProfileLoadError, LoginError } from '@/utils/loginErrors'
import type { Student, User } from '@/types'

interface AuthContextValue {
  user: User | null
  student: Student | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setStudent(null)
      setIsLoading(false)
      return
    }

    try {
      const data = await authApi.me()
      setUser(data.user)
      setStudent(data.student)
    } catch {
      clearTokens()
      setUser(null)
      setStudent(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (identifier: string, password: string, rememberMe: boolean) => {
    const { accessToken, refreshToken, rememberMe: persist } = await authApi.login(
      identifier,
      password,
      rememberMe,
    )

    setTokens(accessToken, refreshToken, persist)

    try {
      const me = await authApi.me()
      setUser(me.user)
      setStudent(me.student)
    } catch {
      clearTokens()
      throw new LoginError(getProfileLoadError())
    }
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStudent(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      student,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refresh,
    }),
    [user, student, isLoading, login, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
