import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react'
import type { Theme } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

const themeOptions: {
  value: Theme
  label: string
  description: string
  icon: typeof Sun
  preview: string
}[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Bright and clean',
    icon: Sun,
    preview: 'bg-white border-gh-border',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Low-light friendly',
    icon: Moon,
    preview: 'bg-[#0d1117] border-gh-border',
  },
  {
    value: 'system',
    label: 'System',
    description: 'Device default',
    icon: Monitor,
    preview: 'bg-gradient-to-br from-white to-[#0d1117] border-gh-border',
  },
]

export function ThemesSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <Card className="overflow-hidden !p-0 animate-fade-in">
      <div className="border-b border-gh-border bg-gradient-to-r from-gh-accent/[0.06] to-transparent p-5">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-gh-accent" aria-hidden="true" />
          <h3 className="text-base font-semibold text-gh-fg">Appearance</h3>
        </div>
        <p className="mt-1 text-sm text-gh-fg-muted">
          Choose how the portal looks on your device.
        </p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Theme">
          {themeOptions.map(({ value, label, description, icon: Icon, preview }) => {
            const isSelected = theme === value

            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(value)}
                className={cn(
                  'relative flex flex-col rounded-xl border p-4 text-left transition-all duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gh-accent',
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

                <div className={cn('mb-3 h-12 w-full rounded-lg border', preview)} aria-hidden="true" />

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      isSelected ? 'bg-gh-accent text-gh-accent-fg' : 'bg-gh-canvas-subtle text-gh-fg-muted',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
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
  )
}
