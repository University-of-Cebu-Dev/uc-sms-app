import {
  defaultPortalBranding,
  PORTAL_BRANDING_STORAGE_KEY,
  type PortalBranding,
} from '@/data/portalBrandingDefaults'

function migrateLegacyBranding(parsed: Partial<PortalBranding> & { campusName?: string }) {
  if (parsed.schoolName?.trim()) {
    return {
      schoolName: parsed.schoolName.trim(),
      campusName: parsed.campusName?.trim() ?? '',
      logoUrl: parsed.logoUrl || defaultPortalBranding.logoUrl,
    }
  }

  const legacyName = parsed.campusName?.trim() ?? ''
  if (legacyName && legacyName !== defaultPortalBranding.schoolName) {
    return {
      schoolName: defaultPortalBranding.schoolName,
      campusName: legacyName,
      logoUrl: parsed.logoUrl || defaultPortalBranding.logoUrl,
    }
  }

  return {
    schoolName: legacyName || defaultPortalBranding.schoolName,
    campusName: '',
    logoUrl: parsed.logoUrl || defaultPortalBranding.logoUrl,
  }
}

export function loadPortalBranding(): PortalBranding {
  try {
    const stored = localStorage.getItem(PORTAL_BRANDING_STORAGE_KEY)
    if (!stored) return defaultPortalBranding

    const parsed = JSON.parse(stored) as Partial<PortalBranding>
    return migrateLegacyBranding(parsed)
  } catch {
    return defaultPortalBranding
  }
}

export function savePortalBranding(branding: PortalBranding) {
  localStorage.setItem(PORTAL_BRANDING_STORAGE_KEY, JSON.stringify(branding))
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
