import {
  CUSTOM_THEME_STORAGE_KEY,
  defaultCustomThemeColors,
} from '@/data/customThemeDefaults'
import type { CustomThemeColors } from '@/types'

const CUSTOM_CSS_VARS = [
  '--color-gh-accent',
  '--color-gh-accent-emphasis',
  '--color-gh-attention',
  '--color-gh-sidebar',
  '--color-gh-header',
  '--color-gh-sidebar-border',
  '--color-gh-sidebar-fg',
  '--color-gh-sidebar-fg-muted',
  '--color-gh-canvas-subtle',
  '--color-gh-border',
  '--color-gh-fg',
] as const

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function parseHex(hex: string) {
  const normalized = hex.replace('#', '').trim()
  if (normalized.length !== 6) return null

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)

  if ([r, g, b].some((channel) => Number.isNaN(channel))) return null
  return { r, g, b }
}

function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, '0'))
    .join('')}`
}

export function mixHex(hex: string, target: string, amount: number) {
  const base = parseHex(hex)
  const mix = parseHex(target)
  if (!base || !mix) return hex

  return toHex({
    r: base.r + (mix.r - base.r) * amount,
    g: base.g + (mix.g - base.g) * amount,
    b: base.b + (mix.b - base.b) * amount,
  })
}

export function normalizeHexColor(value: string, fallback: string) {
  const withHash = value.startsWith('#') ? value : `#${value}`
  return parseHex(withHash) ? withHash.toLowerCase() : fallback
}

export function loadCustomThemeColors(): CustomThemeColors {
  try {
    const stored = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY)
    if (!stored) return defaultCustomThemeColors

    const parsed = JSON.parse(stored) as Partial<CustomThemeColors>
    return {
      accent: normalizeHexColor(parsed.accent ?? '', defaultCustomThemeColors.accent),
      accentEmphasis: normalizeHexColor(
        parsed.accentEmphasis ?? '',
        defaultCustomThemeColors.accentEmphasis,
      ),
      sidebar: normalizeHexColor(parsed.sidebar ?? '', defaultCustomThemeColors.sidebar),
      attention: normalizeHexColor(parsed.attention ?? '', defaultCustomThemeColors.attention),
    }
  } catch {
    return defaultCustomThemeColors
  }
}

export function saveCustomThemeColors(colors: CustomThemeColors) {
  localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(colors))
}

export function applyCustomTheme(colors: CustomThemeColors) {
  const root = document.documentElement
  const sidebarBorder = mixHex(colors.sidebar, '#ffffff', 0.18)
  const canvasSubtle = mixHex(colors.accent, '#ffffff', 0.94)
  const border = mixHex(colors.accent, '#ffffff', 0.72)
  const foreground = mixHex(colors.sidebar, '#000000', 0.82)

  const vars: Record<string, string> = {
    '--color-gh-accent': colors.accent,
    '--color-gh-accent-emphasis': colors.accentEmphasis,
    '--color-gh-attention': colors.attention,
    '--color-gh-sidebar': colors.sidebar,
    '--color-gh-header': colors.sidebar,
    '--color-gh-sidebar-border': sidebarBorder,
    '--color-gh-sidebar-fg': '#f0f7ff',
    '--color-gh-sidebar-fg-muted': mixHex(colors.sidebar, '#ffffff', 0.62),
    '--color-gh-canvas-subtle': canvasSubtle,
    '--color-gh-border': border,
    '--color-gh-fg': foreground,
  }

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export function clearCustomTheme() {
  for (const property of CUSTOM_CSS_VARS) {
    document.documentElement.style.removeProperty(property)
  }
}
