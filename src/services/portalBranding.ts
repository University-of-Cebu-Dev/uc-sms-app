import { apiRequest } from '@/lib/api'
import type { PortalBranding } from '@/data/portalBrandingDefaults'

export interface PortalBrandingDto {
  schoolName: string
  campusName: string
  logoUrl: string
  theme: PortalBranding['theme']
  themeConfigJson: string | null
}

export const portalBrandingApi = {
  get() {
    return apiRequest<PortalBrandingDto>('/portal/branding', { auth: false })
  },

  update(payload: Partial<PortalBranding>) {
    return apiRequest<PortalBrandingDto>('/portal/branding', {
      method: 'PATCH',
      body: payload,
      auth: true,
    })
  },
}
