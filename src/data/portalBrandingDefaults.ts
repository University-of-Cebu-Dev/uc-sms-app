import ucLogo from '@/assets/uc-logo.png'
import { defaultCustomThemeColors } from '@/data/customThemeDefaults'
import type { Theme } from '@/types'

export interface PortalBranding {
  schoolName: string
  campusName: string
  logoUrl: string
  theme: Theme
  themeConfigJson: string | null
}

export const PORTAL_BRANDING_STORAGE_KEY = 'uc-sms-portal-branding'

export const defaultPortalBranding: PortalBranding = {
  schoolName: 'University of Cebu',
  campusName: '',
  logoUrl: ucLogo,
  theme: 'uc',
  themeConfigJson: null,
}

export const defaultPortalThemeConfigJson = JSON.stringify(defaultCustomThemeColors)

export function formatPortalBrandLabel(schoolName: string, campusName: string) {
  const school = schoolName.trim()
  const campus = campusName.trim()

  if (school && campus) {
    return `${school} — ${campus}`
  }

  return school || campus
}
