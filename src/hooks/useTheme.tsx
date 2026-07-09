import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { defaultCustomThemeColors } from '@/data/customThemeDefaults'
import type { CustomThemeColors, Theme } from '@/types'
import {
  applyCustomTheme,
  clearCustomTheme,
  loadCustomThemeColors,
  saveCustomThemeColors,
} from '@/utils/customTheme'
import { usersApi } from '@/services/users'
import { useAuth } from '@/hooks/useAuth'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  customColors: CustomThemeColors
  setTheme: (theme: Theme) => void
  setCustomColors: (colors: CustomThemeColors) => void
  resetCustomColors: () => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'uc' || theme === 'custom') return 'light'
  return theme === 'system' ? getSystemTheme() : theme
}

function applyThemeClasses(theme: Theme, resolved: 'light' | 'dark', colors: CustomThemeColors) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('theme-uc', theme === 'uc')
  root.classList.toggle('theme-custom', theme === 'custom')

  if (theme === 'custom') {
    applyCustomTheme(colors)
    return
  }

  clearCustomTheme()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    return stored ?? 'uc'
  })
  const [customColors, setCustomColorsState] = useState<CustomThemeColors>(loadCustomThemeColors)
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
    applyThemeClasses(theme, resolved, customColors)
    localStorage.setItem('theme', theme)

    if (isAuthenticated && hydratedFromApi) {
      void usersApi.updatePreferences({ theme }).catch(() => undefined)
    }
  }, [theme, customColors, isAuthenticated, hydratedFromApi])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyThemeClasses(theme, resolved, customColors)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, customColors])

  const setTheme = useCallback((nextTheme: Theme) => setThemeState(nextTheme), [])

  const setCustomColors = useCallback((colors: CustomThemeColors) => {
    setCustomColorsState(colors)
    saveCustomThemeColors(colors)
    setThemeState('custom')
  }, [])

  const resetCustomColors = useCallback(() => {
    setCustomColorsState(defaultCustomThemeColors)
    saveCustomThemeColors(defaultCustomThemeColors)
    setThemeState('custom')
  }, [])

  const toggleTheme = useCallback(
    () =>
      setThemeState((prev) => {
        if (prev === 'uc' || prev === 'custom') return 'dark'
        if (prev === 'dark') return 'uc'
        const current = resolveTheme(prev)
        return current === 'dark' ? 'light' : 'dark'
      }),
    [],
  )

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        customColors,
        setTheme,
        setCustomColors,
        resetCustomColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
