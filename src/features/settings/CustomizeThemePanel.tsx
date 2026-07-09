import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { CustomThemeColors } from '@/types'
import { defaultCustomThemeColors } from '@/data/customThemeDefaults'
import { useTheme } from '@/hooks/useTheme'
import { normalizeHexColor } from '@/utils/customTheme'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

type CustomColorField = keyof CustomThemeColors

const colorFields: {
  key: CustomColorField
  label: string
  description: string
}[] = [
  {
    key: 'accent',
    label: 'Primary accent',
    description: 'Buttons, links, and active states',
  },
  {
    key: 'accentEmphasis',
    label: 'Accent hover',
    description: 'Hover and pressed accent tones',
  },
  {
    key: 'sidebar',
    label: 'Sidebar',
    description: 'Sidebar and header background',
  },
  {
    key: 'attention',
    label: 'Highlight',
    description: 'Badges, highlights, and accents',
  },
]

export function CustomizeThemePanel() {
  const { theme, customColors, setCustomColors, resetCustomColors } = useTheme()

  const updateColor = (key: CustomColorField, value: string) => {
    const fallback = defaultCustomThemeColors[key]
    setCustomColors({
      ...customColors,
      [key]: normalizeHexColor(value, fallback),
    })
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-colors',
        theme === 'custom'
          ? 'border-gh-accent/30 bg-gh-accent/[0.04] ring-1 ring-gh-accent/15'
          : 'border-gh-border bg-gh-canvas-subtle/40',
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gh-accent" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-gh-fg">Customize theme</h4>
          </div>
          <p className="mt-1 text-xs text-gh-fg-muted">
            Pick your own accent, sidebar, and highlight colors. Changes apply instantly.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetCustomColors}
          className="shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to UC defaults
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {colorFields.map(({ key, label, description }) => (
          <label
            key={key}
            className="flex items-start gap-3 rounded-xl border border-gh-border bg-gh-canvas p-3"
          >
            <input
              type="color"
              value={customColors[key]}
              onChange={(event) => updateColor(key, event.target.value)}
              className="mt-0.5 h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-gh-border bg-transparent p-0.5"
              aria-label={`${label} color picker`}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-gh-fg">{label}</span>
              <span className="mt-0.5 block text-[11px] text-gh-fg-muted">{description}</span>
              <Input
                value={customColors[key]}
                onChange={(event) => updateColor(key, event.target.value)}
                className="mt-2 font-mono text-xs"
                aria-label={`${label} hex value`}
              />
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-gh-border">
        <div className="flex h-14">
          <div className="w-1/3" style={{ backgroundColor: customColors.sidebar }} />
          <div className="flex flex-1">
            <div className="flex-1" style={{ backgroundColor: customColors.accent }} />
            <div className="w-1/4" style={{ backgroundColor: customColors.attention }} />
          </div>
        </div>
        <p className="border-t border-gh-border bg-gh-canvas-subtle px-3 py-2 text-[11px] text-gh-fg-muted">
          Preview: sidebar, primary accent, and highlight
        </p>
      </div>
    </div>
  )
}
