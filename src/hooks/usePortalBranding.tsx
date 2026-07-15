import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  defaultPortalBranding,
  type PortalBranding,
} from '@/data/portalBrandingDefaults'
import { portalBrandingApi } from '@/services/portalBranding'
import type { Theme } from '@/types'
import {
  clearPortalBranding,
  loadPortalBranding,
  normalizePortalBranding,
  savePortalBranding,
  toApiLogoUrl,
} from '@/utils/portalBranding'

interface PortalBrandingContextValue extends PortalBranding {
  isLoading: boolean
  setSchoolName: (schoolName: string) => Promise<void>
  setCampusName: (campusName: string) => Promise<void>
  setLogoUrl: (logoUrl: string) => Promise<void>
  setTheme: (theme: Theme, themeConfigJson?: string | null) => Promise<void>
  resetBranding: () => Promise<void>
  reloadBranding: () => Promise<void>
}

const PortalBrandingContext = createContext<PortalBrandingContextValue | null>(null)

let brandingLoadPromise: Promise<void> | null = null

export function PortalBrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<PortalBranding>(loadPortalBranding)
  const [isLoading, setIsLoading] = useState(true)

  const applyBranding = useCallback((next: PortalBranding) => {
    const normalized = normalizePortalBranding(next)
    setBranding(normalized)
    savePortalBranding(normalized)
    return normalized
  }, [])

  const reloadBranding = useCallback(async () => {
    if (brandingLoadPromise) {
      return brandingLoadPromise
    }

    brandingLoadPromise = (async () => {
      try {
        const data = await portalBrandingApi.get()
        applyBranding(data)
      } catch {
        applyBranding(loadPortalBranding())
      } finally {
        setIsLoading(false)
        brandingLoadPromise = null
      }
    })()

    return brandingLoadPromise
  }, [applyBranding])

  useEffect(() => {
    void reloadBranding()
  }, [reloadBranding])

  const updateBranding = useCallback(
    async (updates: Partial<PortalBranding>) => {
      const previous = branding
      const optimistic = normalizePortalBranding({ ...previous, ...updates })
      setBranding(optimistic)

      try {
        const data = await portalBrandingApi.update({
          schoolName: updates.schoolName,
          campusName: updates.campusName,
          logoUrl:
            updates.logoUrl !== undefined ? toApiLogoUrl(updates.logoUrl) : undefined,
          theme: updates.theme,
          themeConfigJson: updates.themeConfigJson,
        })
        applyBranding(data)
      } catch (error) {
        applyBranding(previous)
        throw error
      }
    },
    [applyBranding, branding],
  )

  const setSchoolName = useCallback(
    async (schoolName: string) => {
      await updateBranding({
        schoolName: schoolName.trim() || defaultPortalBranding.schoolName,
      })
    },
    [updateBranding],
  )

  const setCampusName = useCallback(
    async (campusName: string) => {
      await updateBranding({ campusName: campusName.trim() })
    },
    [updateBranding],
  )

  const setLogoUrl = useCallback(
    async (logoUrl: string) => {
      await updateBranding({ logoUrl: logoUrl || defaultPortalBranding.logoUrl })
    },
    [updateBranding],
  )

  const setTheme = useCallback(
    async (theme: Theme, themeConfigJson?: string | null) => {
      await updateBranding({
        theme,
        themeConfigJson:
          themeConfigJson === undefined ? branding.themeConfigJson : themeConfigJson,
      })
    },
    [branding.themeConfigJson, updateBranding],
  )

  const resetBranding = useCallback(async () => {
    clearPortalBranding()
    try {
      const data = await portalBrandingApi.update({
        schoolName: defaultPortalBranding.schoolName,
        campusName: defaultPortalBranding.campusName,
        logoUrl: '',
        theme: defaultPortalBranding.theme,
        themeConfigJson: null,
      })
      applyBranding(data)
    } catch {
      applyBranding(defaultPortalBranding)
      throw new Error('Could not reset portal settings.')
    }
  }, [applyBranding])

  const value = useMemo(
    () => ({
      schoolName: branding.schoolName,
      campusName: branding.campusName,
      logoUrl: branding.logoUrl,
      theme: branding.theme,
      themeConfigJson: branding.themeConfigJson,
      isLoading,
      setSchoolName,
      setCampusName,
      setLogoUrl,
      setTheme,
      resetBranding,
      reloadBranding,
    }),
    [
      branding,
      isLoading,
      reloadBranding,
      resetBranding,
      setCampusName,
      setLogoUrl,
      setSchoolName,
      setTheme,
    ],
  )

  return (
    <PortalBrandingContext.Provider value={value}>{children}</PortalBrandingContext.Provider>
  )
}

export function usePortalBranding() {
  const ctx = useContext(PortalBrandingContext)
  if (!ctx) {
    throw new Error('usePortalBranding must be used within PortalBrandingProvider')
  }
  return ctx
}
