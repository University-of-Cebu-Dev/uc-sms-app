import { useEffect, useRef, useState } from 'react'
import { Building2, ImageUp, RotateCcw } from 'lucide-react'
import { usePortalBranding } from '@/hooks/usePortalBranding'
import { useToast } from '@/hooks/useToast'
import { defaultPortalBranding } from '@/data/portalBrandingDefaults'
import { readLogoFile } from '@/utils/portalBranding'
import { AppBrand } from '@/components/common/AppBrand'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export function GeneralSettings() {
  const {
    schoolName,
    campusName,
    logoUrl,
    setSchoolName,
    setCampusName,
    setLogoUrl,
    resetBranding,
  } = usePortalBranding()
  const { addToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draftSchoolName, setDraftSchoolName] = useState(schoolName)
  const [draftCampusName, setDraftCampusName] = useState(campusName)

  useEffect(() => {
    setDraftSchoolName(schoolName)
  }, [schoolName])

  useEffect(() => {
    setDraftCampusName(campusName)
  }, [campusName])

  const handleSchoolNameBlur = () => {
    const trimmed = draftSchoolName.trim()
    if (!trimmed) {
      setDraftSchoolName(schoolName)
      return
    }

    if (trimmed !== schoolName) {
      setSchoolName(trimmed)
      addToast('success', 'School name updated')
    }
  }

  const handleCampusNameBlur = () => {
    const trimmed = draftCampusName.trim()
    if (trimmed !== campusName) {
      setCampusName(trimmed)
      addToast('success', 'Campus name updated')
    }
  }

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const dataUrl = await readLogoFile(file)
      setLogoUrl(dataUrl)
      addToast('success', 'Logo updated')
    } catch (error) {
      addToast('error', 'Logo upload failed', error instanceof Error ? error.message : undefined)
    }
  }

  const handleReset = () => {
    resetBranding()
    setDraftSchoolName(defaultPortalBranding.schoolName)
    setDraftCampusName(defaultPortalBranding.campusName)
    addToast('success', 'Branding reset', 'Restored default school name, campus name, and logo.')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="overflow-hidden !p-0">
        <div className="border-b border-gh-border bg-gradient-to-r from-gh-accent/[0.06] to-transparent p-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gh-accent" aria-hidden="true" />
            <h3 className="text-base font-semibold text-gh-fg">General</h3>
          </div>
          <p className="mt-1 text-sm text-gh-fg-muted">
            Set the school name, campus name, and logo shown across the portal.
          </p>
        </div>

        <div className="space-y-6 p-5">
          <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gh-fg-subtle">
              Preview
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <AppBrand logoClassName="h-10" titleClassName="text-base" />
              <AppBrand showTitle={false} logoClassName="h-9" />
            </div>
          </div>

          <Input
            label="School name"
            value={draftSchoolName}
            onChange={(event) => setDraftSchoolName(event.target.value)}
            onBlur={handleSchoolNameBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur()
              }
            }}
            placeholder={defaultPortalBranding.schoolName}
            hint="The institution name, e.g. University of Cebu."
          />

          <Input
            label="Campus name"
            value={draftCampusName}
            onChange={(event) => setDraftCampusName(event.target.value)}
            onBlur={handleCampusNameBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur()
              }
            }}
            placeholder="e.g. Banilad Campus"
            hint="Optional. Shown below the school name in the sidebar and login screen."
          />

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gh-fg">Logo / icon</p>
              <p className="mt-0.5 text-xs text-gh-fg-muted">
                PNG, JPG, SVG, or WebP up to 512 KB. Shown beside the school and campus names.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-gh-border bg-gh-canvas p-2">
                <img
                  src={logoUrl}
                  alt={`${schoolName} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageUp className="h-4 w-4" />
                  Upload logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="sr-only"
                  onChange={(event) => void handleLogoChange(event)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gh-border pt-4">
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
