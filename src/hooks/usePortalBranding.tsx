import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultPortalBranding, type PortalBranding } from '@/data/portalBrandingDefaults'
import { clearPortalBranding, loadPortalBranding, savePortalBranding } from '@/utils/portalBranding'

interface PortalBrandingContextValue extends PortalBranding {
  setSchoolName: (schoolName: string) => void
  setCampusName: (campusName: string) => void
  setLogoUrl: (logoUrl: string) => void
  resetBranding: () => void
}

const PortalBrandingContext = createContext<PortalBrandingContextValue | null>(null)

export function PortalBrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<PortalBranding>(loadPortalBranding)

  const persist = useCallback((updater: PortalBranding | ((current: PortalBranding) => PortalBranding)) => {
    setBranding((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      savePortalBranding(next)
      return next
    })
  }, [])

  const setSchoolName = useCallback(
    (schoolName: string) => {
      persist((current) => ({
        ...current,
        schoolName: schoolName.trim() || defaultPortalBranding.schoolName,
      }))
    },
    [persist],
  )

  const setCampusName = useCallback(
    (campusName: string) => {
      persist((current) => ({
        ...current,
        campusName: campusName.trim(),
      }))
    },
    [persist],
  )

  const setLogoUrl = useCallback(
    (logoUrl: string) => {
      persist((current) => ({
        ...current,
        logoUrl: logoUrl || defaultPortalBranding.logoUrl,
      }))
    },
    [persist],
  )

  const resetBranding = useCallback(() => {
    clearPortalBranding()
    setBranding(defaultPortalBranding)
  }, [])

  const value = useMemo(
    () => ({
      schoolName: branding.schoolName,
      campusName: branding.campusName,
      logoUrl: branding.logoUrl,
      setSchoolName,
      setCampusName,
      setLogoUrl,
      resetBranding,
    }),
    [branding, resetBranding, setCampusName, setLogoUrl, setSchoolName],
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
