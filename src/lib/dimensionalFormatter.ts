import type { DecimalFeet } from '../types'

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

function reduceFraction(num: number, den: number): [number, number] {
  const g = gcd(num, den)
  return [num / g, den / g]
}

/**
 * Format decimal feet → feet-inches-fractions string
 * precision = 16 means nearest 1/16"
 */
export function formatFeetInches(decimalFeet: number, precision = 16): string {
  if (!isFinite(decimalFeet)) return 'Error'

  const negative = decimalFeet < 0
  const absFeet = Math.abs(decimalFeet)

  let totalInches = absFeet * 12
  let feetPart = Math.floor(totalInches / 12)
  let remainingInches = totalInches - feetPart * 12

  // Round to nearest 1/precision
  let fracUnits = Math.round(remainingInches * precision)

  // Handle carry
  if (fracUnits >= precision * 12) {
    fracUnits = 0
    feetPart += 1
    remainingInches = 0
  }

  const wholeInches = Math.floor(fracUnits / precision)
  const fracNum = fracUnits - wholeInches * precision

  let result = negative ? '-' : ''

  if (feetPart > 0) {
    result += `${feetPart}'`
  }

  if (wholeInches > 0 || fracNum > 0) {
    if (feetPart > 0) result += ' '
    result += `${wholeInches}`
    if (fracNum > 0) {
      const [rNum, rDen] = reduceFraction(fracNum, precision)
      result += ` ${rNum}/${rDen}`
    }
    result += '"'
  } else if (feetPart === 0) {
    result += '0"'
  }

  return result.trim()
}

export function formatDecimalFeet(decimalFeet: number, places = 4): string {
  if (!isFinite(decimalFeet)) return 'Error'
  return `${decimalFeet.toFixed(places)}'`
}

export function formatMetric(decimalFeet: number): string {
  if (!isFinite(decimalFeet)) return 'Error'
  const meters = decimalFeet * 0.3048
  return `${meters.toFixed(3)} m`
}

export function formatDegrees(degrees: number, places = 2): string {
  if (!isFinite(degrees)) return 'Error'
  return `${degrees.toFixed(places)}°`
}

export function formatSquareFeet(sqft: number): string {
  if (!isFinite(sqft)) return 'Error'
  return `${sqft.toFixed(2)} ft²`
}

export function formatCubicFeet(cuft: number): string {
  if (!isFinite(cuft)) return 'Error'
  return `${cuft.toFixed(2)} ft³`
}

export function formatDollars(amount: number): string {
  if (!isFinite(amount)) return 'Error'
  return `$${amount.toFixed(2)}`
}

export function formatCount(n: number): string {
  return `${Math.round(n)}`
}

export function formatInches(decimalFeet: number): string {
  if (!isFinite(decimalFeet)) return 'Error'
  const totalInches = decimalFeet * 12
  const whole = Math.floor(totalInches)
  const frac = totalInches - whole
  const precision = 16
  const fracUnits = Math.round(frac * precision)
  if (fracUnits === 0) return `${whole}"`
  const [rNum, rDen] = reduceFraction(fracUnits, precision)
  return `${whole} ${rNum}/${rDen}"`
}
