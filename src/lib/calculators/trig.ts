export type TrigFn = 'sin' | 'cos' | 'tan'
export type InverseTrigFn = 'asin' | 'acos' | 'atan'
export type AngleUnit = 'degrees' | 'radians'

function toRad(deg: number) { return (deg * Math.PI) / 180 }
function toDeg(rad: number) { return (rad * 180) / Math.PI }

export function calcTrig(fn: TrigFn, angle: number, unit: AngleUnit): number {
  const rad = unit === 'degrees' ? toRad(angle) : angle
  switch (fn) {
    case 'sin': return Math.sin(rad)
    case 'cos': return Math.cos(rad)
    case 'tan': return Math.tan(rad)
  }
}

export function calcInverseTrig(fn: InverseTrigFn, value: number, unit: AngleUnit): number {
  if ((fn === 'asin' || fn === 'acos') && (value < -1 || value > 1)) {
    throw new RangeError(`${fn} requires input in [-1, 1], got ${value}`)
  }
  let rad: number
  switch (fn) {
    case 'asin': rad = Math.asin(value); break
    case 'acos': rad = Math.acos(value); break
    case 'atan': rad = Math.atan(value); break
  }
  if (!isFinite(rad!)) throw new RangeError(`${fn}(${value}) produced non-finite result`)
  return unit === 'degrees' ? toDeg(rad!) : rad!
}

export function degreesToRadians(deg: number): number { return toRad(deg) }
export function radiansToDegrees(rad: number): number { return toDeg(rad) }
