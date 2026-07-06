const TERM_LABELS: Record<string, string> = {
  '1': '1st Semester',
  '2': '2nd Semester',
  '4': 'Summer',
}

export function isActiveTermCode(value: string) {
  return /^\d{5}$/.test(value.trim())
}

/** Parse a 5-digit active term code (e.g. 20271) into period name and term label. */
export function derivePeriodFieldsFromActiveTerm(activeTerm: string): {
  name: string
  term: string
} | null {
  const normalized = activeTerm.trim()
  if (!isActiveTermCode(normalized)) return null

  const termLabel = TERM_LABELS[normalized[4]]
  if (!termLabel) return null

  const endYear = Number.parseInt(normalized.slice(0, 4), 10)
  const startYear = endYear - 1
  const schoolYear = `SY ${startYear}-${endYear}`

  return {
    term: termLabel,
    name: `${termLabel}, ${schoolYear}`,
  }
}
