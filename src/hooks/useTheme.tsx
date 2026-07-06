import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Theme } from '@/types'
import { usersApi } from '@/services/users'
import { useAuth } from '@/hooks/useAuth'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    return stored ?? 'light'
  })
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(theme))
  const [hydratedFromApi, setHydratedFromApi] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || hydratedFromApi) return

    usersApi
      .getPreferences()
      .then((preferences) => {
        if (preferences.theme) {
          setThemeState(preferences.theme)
        }
      })
      .catch(() => undefined)
      .finally(() => setHydratedFromApi(true))
  }, [isAuthenticated, hydratedFromApi])

  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    localStorage.setItem('theme', theme)

    if (isAuthenticated && hydratedFromApi) {
      void usersApi.updatePreferences({ theme }).catch(() => undefined)
    }
  }, [theme, isAuthenticated, hydratedFromApi])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((nextTheme: Theme) => setThemeState(nextTheme), [])
  const toggleTheme = useCallback(
    () =>
      setThemeState((prev) => {
        const current = resolveTheme(prev)
        return current === 'dark' ? 'light' : 'dark'
      }),
    [],
  )

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
