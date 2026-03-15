export type SpacingMeasurement = 'cc' | 'ii' | 'io' | 'oi' | 'oo'

export interface SpacingInputs {
  value: number           // decimal feet
  type: SpacingMeasurement
  studThickness: number   // decimal feet (default 1.5" = 0.125 ft)
  wallLength?: number     // decimal feet (optional)
}

export interface SpacingResults {
  cc: number   // center to center (OC)
  ii: number   // inside to inside (clear gap)
  io: number   // inside to outside
  oi: number   // outside to inside
  oo: number   // outside to outside
  studCount?: number
  totalRun?: number
}

// All measurements derived from center-to-center (S) and stud thickness (T):
// cc = S
// ii = S - T        (clear gap between faces)
// io = S            (inner face of 1 → outer face of 2 = S)
// oi = S            (outer face of 1 → inner face of 2 = S)
// oo = S + T        (outer face of 1 → outer face of 2)

export function calculateSpacing(inputs: SpacingInputs): SpacingResults | null {
  const { value, type, studThickness, wallLength } = inputs
  if (value <= 0 || studThickness <= 0) return null

  let cc: number

  switch (type) {
    case 'cc': cc = value; break
    case 'ii': cc = value + studThickness; break
    case 'io': cc = value; break
    case 'oi': cc = value; break
    case 'oo': cc = value - studThickness; break
  }

  if (cc <= 0) return null

  const ii = cc - studThickness
  const oo = cc + studThickness

  const results: SpacingResults = {
    cc,
    ii: Math.max(0, ii),
    io: cc,
    oi: cc,
    oo,
  }

  if (wallLength && wallLength > 0) {
    // Number of spaces = floor(wallLength / cc)
    // Number of studs = spaces + 1 (including both end studs)
    const spaces = Math.floor(wallLength / cc)
    results.studCount = spaces + 1
    results.totalRun = spaces * cc
  }

  return results
}
