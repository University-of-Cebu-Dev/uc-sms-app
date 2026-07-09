/** University of Cebu brand colors derived from the official logo */
export const ucBrand = {
  navy: '#003087',
  navyDark: '#001f5c',
  navyLight: '#004799',
  cyan: '#00a8e8',
  cyanDark: '#0088c4',
  gold: '#ffc20e',
  goldDark: '#e6ad00',
  sky: '#f4f8fc',
  white: '#ffffff',
} as const

export const ucBrandTheme = {
  id: 'uc' as const,
  label: 'University of Cebu',
  description: 'Official navy, cyan, and gold from the UC logo',
  swatches: [ucBrand.navy, ucBrand.cyan, ucBrand.gold],
}
