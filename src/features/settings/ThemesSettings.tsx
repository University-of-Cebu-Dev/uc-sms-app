import { Check, Monitor, Moon, Palette, SlidersHorizontal, Sun, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import ucLogo from '@/assets/uc-logo.png'
import type { Theme } from '@/types'
import { ucBrand, ucBrandTheme } from '@/data/ucBrand'
import { useTheme } from '@/hooks/useTheme'
import { CustomizeThemePanel } from '@/features/settings/CustomizeThemePanel'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

const themeOptions: {
  value: Theme
  label: string
  description: string
  icon: LucideIcon
  preview: ReactNode
}[] = [
  {
    value: 'uc',
    label: ucBrandTheme.label,
    description: ucBrandTheme.description,
    icon: Palette,
    preview: (
      <div className="flex h-full w-full overflow-hidden rounded-lg border border-gh-border">
        <div className="w-1/3" style={{ backgroundColor: ucBrand.navy }} />
        <div className="flex flex-1 flex-col">
          <div className="h-1/2" style={{ backgroundColor: ucBrand.cyan }} />
          <div className="h-1/2" style={{ backgroundColor: ucBrand.gold }} />
        </div>
      </div>
    ),
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Your own color palette',
    icon: SlidersHorizontal,
    preview: (
      <div className="flex h-full w-full overflow-hidden rounded-lg border border-gh-border">
        <div className="w-1/4 bg-[#003087]" />
        <div className="w-1/4 bg-[#00a8e8]" />
        <div className="w-1/4 bg-[#ffc20e]" />
        <div className="flex-1 bg-gradient-to-br from-violet-500 to-fuchsia-500" />
      </div>
    ),
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Bright and clean',
    icon: Sun,
    preview: <div className="h-full w-full rounded-lg border border-gh-border bg-white" />,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Low-light friendly',
    icon: Moon,
    preview: <div className="h-full w-full rounded-lg border border-gh-border bg-[#0d1117]" />,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Device default',
    icon: Monitor,
    preview: (
      <div className="h-full w-full rounded-lg border border-gh-border bg-gradient-to-br from-white to-[#0d1117]" />
    ),
  },
]

export function ThemesSettings() {
  const { theme, customColors, setTheme, canChangeTheme } = useTheme()

  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="overflow-hidden !p-0">
        <div className="border-b border-gh-border bg-gradient-to-r from-gh-accent/[0.06] to-transparent p-5">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gh-accent" aria-hidden="true" />
            <h3 className="text-base font-semibold text-gh-fg">Appearance</h3>
          </div>
          <p className="mt-1 text-sm text-gh-fg-muted">
            {canChangeTheme
              ? 'Choose a preset or build your own theme for the entire portal.'
              : 'Portal theme is managed by SuperAdmin and applies to all users.'}
          </p>
        </div>

        <div className="p-5">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3"
            role="radiogroup"
            aria-label="Theme"
          >
            {themeOptions.map(({ value, label, description, icon: Icon, preview }) => {
              const isSelected = theme === value

              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={!canChangeTheme}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'relative flex flex-col rounded-xl border p-4 text-left transition-all duration-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
                    !canChangeTheme && 'cursor-default opacity-80',
                    isSelected
                      ? 'border-gh-accent bg-gh-accent/5 ring-2 ring-gh-accent/20 shadow-md shadow-gh-accent/10'
                      : 'border-gh-border bg-gh-canvas hover:border-gh-accent/30 hover:shadow-sm',
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gh-accent text-gh-accent-fg">
                      <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
                    </span>
                  )}

                  <div className="mb-3 h-12 w-full" aria-hidden="true">
                    {value === 'custom' ? (
                      <div className="flex h-full w-full overflow-hidden rounded-lg border border-gh-border">
                        <div className="w-1/3" style={{ backgroundColor: customColors.sidebar }} />
                        <div className="flex flex-1 flex-col">
                          <div className="h-1/2" style={{ backgroundColor: customColors.accent }} />
                          <div
                            className="h-1/2"
                            style={{ backgroundColor: customColors.attention }}
                          />
                        </div>
                      </div>
                    ) : (
                      preview
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden',
                        isSelected
                          ? 'bg-gh-accent text-gh-accent-fg'
                          : 'bg-gh-canvas-subtle text-gh-fg-muted',
                      )}
                    >
                      {value === 'uc' ? (
                        <img src={ucLogo} alt="" className="h-6 w-auto object-contain" />
                      ) : (
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gh-fg">{label}</p>
                      <p className="text-[11px] text-gh-fg-muted">{description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {canChangeTheme ? <CustomizeThemePanel /> : null}
    </div>
  )
}
