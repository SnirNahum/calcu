import type { DecimalFeet } from '../types'

/**
 * Parses a dimensional string into decimal feet.
 *
 * Supported formats:
 *   "12"         → 12 feet
 *   "12'"        → 12 feet
 *   "6\""        → 0.5 feet (6 inches)
 *   "12'6"       → 12.5 feet
 *   "12'6 3/4"   → 12.5625 feet
 *   "12'6-3/4"   → 12.5625 feet
 *   "0.5"        → 0.5 feet (decimal)
 *   "6/12"       → treated as pitch fraction when in pitch context
 */
export function parseDimensional(input: string): DecimalFeet | null {
  if (!input || input.trim() === '' || input === "'" || input === '"') return null

  const s = input.trim()

  // Pure decimal
  if (/^-?\d*\.?\d+$/.test(s)) {
    const v = parseFloat(s)
    return isNaN(v) ? null : v
  }

  // Standalone fraction like "3/4" → treat as inches fraction (e.g. 0.75 inches = 0.0625 ft)
  if (/^\d+\/\d+$/.test(s)) {
    const frac = parseFraction(s)
    if (frac === null) return null
    return frac / 12
  }

  // Inches only: e.g. "6"" or "6 3/4""
  if (s.endsWith('"')) {
    const inner = s.slice(0, -1)
    const inches = parseInchesString(inner)
    if (inches === null) return null
    return inches / 12
  }

  // Has feet marker
  if (s.includes("'")) {
    const parts = s.split("'")
    const feetStr = parts[0]
    const inchStr = parts[1] ?? ''

    const feet = feetStr === '' ? 0 : parseFloat(feetStr)
    if (isNaN(feet)) return null

    if (inchStr === '' || inchStr === undefined) {
      return feet
    }

    const inches = parseInchesString(inchStr)
    if (inches === null) return null

    return feet + inches / 12
  }

  return null
}

function parseInchesString(s: string): number | null {
  if (s === '' || s === undefined) return 0

  // Replace dash between whole inches and fraction (but not leading negative)
  const normalized = s.replace(/(\d)-(\d)/, '$1 $2')
  const tokens = normalized.trim().split(/\s+/)

  let wholeInches = 0
  let fracValue = 0

  if (tokens.length === 0) return 0

  // Could be "6 3/4" or "3/4" or "6"
  if (tokens[0].includes('/')) {
    // Just a fraction, no whole inches
    fracValue = parseFraction(tokens[0]) ?? 0
  } else {
    wholeInches = parseFloat(tokens[0])
    if (isNaN(wholeInches)) return null

    if (tokens[1] && tokens[1].includes('/')) {
      fracValue = parseFraction(tokens[1]) ?? 0
    }
  }

  return wholeInches + fracValue
}

function parseFraction(s: string): number | null {
  const parts = s.split('/')
  if (parts.length !== 2) return null
  const num = parseFloat(parts[0])
  const den = parseFloat(parts[1])
  if (isNaN(num) || isNaN(den) || den === 0) return null
  return num / den
}

/** Parse a pitch string like "6/12" → returns rise per foot of run (0.5) */
export function parsePitch(input: string): number | null {
  if (!input) return null
  const s = input.trim()
  if (s.includes('/')) {
    return parseFraction(s)
  }
  const v = parseFloat(s)
  return isNaN(v) ? null : v / 12
}

/** Returns decimal feet value of a raw input string, supporting all formats */
export function parseInputValue(raw: string): DecimalFeet | null {
  return parseDimensional(raw)
}
