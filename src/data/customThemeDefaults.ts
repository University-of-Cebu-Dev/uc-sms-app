import { ucBrand } from '@/data/ucBrand'
import type { CustomThemeColors } from '@/types'

export const CUSTOM_THEME_STORAGE_KEY = 'customThemeColors'

export const defaultCustomThemeColors: CustomThemeColors = {
  accent: ucBrand.cyan,
  accentEmphasis: ucBrand.cyanDark,
  sidebar: ucBrand.navy,
  attention: ucBrand.gold,
}
