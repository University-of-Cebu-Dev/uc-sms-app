import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { defaultCustomThemeColors } from '@/data/customThemeDefaults'
import { defaultPortalBranding } from '@/data/portalBrandingDefaults'
import { usePermissions } from '@/hooks/usePermissions'
import { usePortalBranding } from '@/hooks/usePortalBranding'
import { useToast } from '@/hooks/useToast'
import type { CustomThemeColors, Theme } from '@/types'
import {
  applyCustomTheme,
  clearCustomTheme,
  saveCustomThemeColors,
} from '@/utils/customTheme'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  customColors: CustomThemeColors
  canChangeTheme: boolean
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

function parseThemeConfigJson(themeConfigJson: string | null): CustomThemeColors {
  if (!themeConfigJson) {
    return defaultCustomThemeColors
  }

  try {
    return { ...defaultCustomThemeColors, ...JSON.parse(themeConfigJson) } as CustomThemeColors
  } catch {
    return defaultCustomThemeColors
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isSuperAdmin } = usePermissions()
  const { addToast } = useToast()
  const {
    theme: portalTheme,
    themeConfigJson,
    isLoading: brandingLoading,
    setTheme: savePortalTheme,
  } = usePortalBranding()

  const [theme, setThemeState] = useState<Theme>(defaultPortalBranding.theme)
  const [customColors, setCustomColorsState] = useState<CustomThemeColors>(defaultCustomThemeColors)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(defaultPortalBranding.theme),
  )
  const hasHydratedFromPortalRef = useRef(false)

  useEffect(() => {
    if (brandingLoading || hasHydratedFromPortalRef.current) return

    setThemeState(portalTheme)
    setCustomColorsState(parseThemeConfigJson(themeConfigJson))
    hasHydratedFromPortalRef.current = true
  }, [brandingLoading, portalTheme, themeConfigJson])

  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyThemeClasses(theme, resolved, customColors)
  }, [theme, customColors])

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

  const persistTheme = useCallback(
    async (nextTheme: Theme, colors: CustomThemeColors, previousTheme: Theme, previousColors: CustomThemeColors) => {
      if (!isSuperAdmin) return

      const themeConfigJsonValue =
        nextTheme === 'custom' ? JSON.stringify(colors) : null

      try {
        saveCustomThemeColors(colors)
        await savePortalTheme(nextTheme, themeConfigJsonValue)
      } catch {
        setThemeState(previousTheme)
        setCustomColorsState(previousColors)
        applyThemeClasses(previousTheme, resolveTheme(previousTheme), previousColors)
        addToast('error', 'Could not save portal theme.')
      }
    },
    [isSuperAdmin, savePortalTheme, addToast],
  )

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      if (!isSuperAdmin) return

      const previousTheme = theme
      const previousColors = customColors
      setThemeState(nextTheme)
      void persistTheme(nextTheme, customColors, previousTheme, previousColors)
    },
    [customColors, isSuperAdmin, persistTheme, theme],
  )

  const setCustomColors = useCallback(
    (colors: CustomThemeColors) => {
      if (!isSuperAdmin) return

      const previousTheme = theme
      const previousColors = customColors
      setCustomColorsState(colors)
      setThemeState('custom')
      void persistTheme('custom', colors, previousTheme, previousColors)
    },
    [customColors, isSuperAdmin, persistTheme, theme],
  )

  const resetCustomColors = useCallback(() => {
    if (!isSuperAdmin) return

    const previousTheme = theme
    const previousColors = customColors
    setCustomColorsState(defaultCustomThemeColors)
    setThemeState('custom')
    void persistTheme('custom', defaultCustomThemeColors, previousTheme, previousColors)
  }, [customColors, isSuperAdmin, persistTheme, theme])

  const toggleTheme = useCallback(() => {
    if (!isSuperAdmin) return

    setThemeState((prev) => {
      const next =
        prev === 'uc' || prev === 'custom'
          ? 'dark'
          : prev === 'dark'
            ? 'uc'
            : resolveTheme(prev) === 'dark'
              ? 'light'
              : 'dark'

      void persistTheme(next, customColors, prev, customColors)
      return next
    })
  }, [customColors, isSuperAdmin, persistTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        customColors,
        canChangeTheme: isSuperAdmin,
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
