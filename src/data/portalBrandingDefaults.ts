import ucLogo from '@/assets/uc-logo.png'

export interface PortalBranding {
  schoolName: string
  campusName: string
  logoUrl: string
}

export const PORTAL_BRANDING_STORAGE_KEY = 'uc-sms-portal-branding'

export const defaultPortalBranding: PortalBranding = {
  schoolName: 'University of Cebu',
  campusName: '',
  logoUrl: ucLogo,
}

export function formatPortalBrandLabel(schoolName: string, campusName: string) {
  const school = schoolName.trim()
  const campus = campusName.trim()

  if (school && campus) {
    return `${school} — ${campus}`
  }

  return school || campus
}
