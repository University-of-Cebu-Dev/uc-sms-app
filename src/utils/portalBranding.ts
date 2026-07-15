import {
  defaultPortalBranding,
  PORTAL_BRANDING_STORAGE_KEY,
  type PortalBranding,
} from '@/data/portalBrandingDefaults'
import type { Theme } from '@/types'

const validThemes = new Set<Theme>(['light', 'dark', 'system', 'uc', 'custom'])

function normalizeTheme(theme?: string | null): Theme {
  if (theme && validThemes.has(theme as Theme)) {
    return theme as Theme
  }

  return defaultPortalBranding.theme
}

function migrateLegacyBranding(
  parsed: Partial<PortalBranding> & { campusName?: string; theme?: string },
) {
  if (parsed.schoolName?.trim()) {
    return {
      schoolName: parsed.schoolName.trim(),
      campusName: parsed.campusName?.trim() ?? '',
      logoUrl: parsed.logoUrl || defaultPortalBranding.logoUrl,
      theme: normalizeTheme(parsed.theme),
      themeConfigJson: parsed.themeConfigJson ?? null,
    }
  }

  const legacyName = parsed.campusName?.trim() ?? ''
  if (legacyName && legacyName !== defaultPortalBranding.schoolName) {
    return {
      schoolName: defaultPortalBranding.schoolName,
      campusName: legacyName,
      logoUrl: parsed.logoUrl || defaultPortalBranding.logoUrl,
      theme: normalizeTheme(parsed.theme),
      themeConfigJson: parsed.themeConfigJson ?? null,
    }
  }

  return {
    schoolName: legacyName || defaultPortalBranding.schoolName,
    campusName: '',
    logoUrl: parsed.logoUrl || defaultPortalBranding.logoUrl,
    theme: normalizeTheme(parsed.theme),
    themeConfigJson: parsed.themeConfigJson ?? null,
  }
}

export function normalizePortalBranding(branding: Partial<PortalBranding>): PortalBranding {
  const schoolName = branding.schoolName?.trim() || defaultPortalBranding.schoolName
  const campusName = branding.campusName?.trim() ?? ''
  const logoUrl = branding.logoUrl?.trim()
    ? branding.logoUrl.trim()
    : defaultPortalBranding.logoUrl

  return {
    schoolName,
    campusName,
    logoUrl,
    theme: normalizeTheme(branding.theme),
    themeConfigJson: branding.themeConfigJson ?? null,
  }
}

export function toApiLogoUrl(logoUrl: string) {
  return logoUrl === defaultPortalBranding.logoUrl ? '' : logoUrl
}

export function loadPortalBranding(): PortalBranding {
  try {
    const stored = localStorage.getItem(PORTAL_BRANDING_STORAGE_KEY)
    if (!stored) return defaultPortalBranding

    const parsed = JSON.parse(stored) as Partial<PortalBranding>
    return normalizePortalBranding(migrateLegacyBranding(parsed))
  } catch {
    return defaultPortalBranding
  }
}

export function savePortalBranding(branding: PortalBranding) {
  try {
    localStorage.setItem(PORTAL_BRANDING_STORAGE_KEY, JSON.stringify(branding))
  } catch {
    // Logo data URLs can exceed localStorage quota; keep in-memory state working.
  }
}

export function clearPortalBranding() {
  localStorage.removeItem(PORTAL_BRANDING_STORAGE_KEY)
}

const MAX_LOGO_BYTES = 512 * 1024

export function readLogoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file (PNG, JPG, SVG, or WebP).'))
      return
    }

    if (file.size > MAX_LOGO_BYTES) {
      reject(new Error('Logo must be 512 KB or smaller.'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Could not read the selected image.'))
    }
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.readAsDataURL(file)
  })
}
