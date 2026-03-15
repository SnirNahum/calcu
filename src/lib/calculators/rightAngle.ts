export interface RightAngleInputs {
  rise?: number   // decimal feet
  run?: number    // decimal feet
  diagonal?: number // decimal feet (hypotenuse)
  pitch?: number  // as decimal ratio (e.g. 0.5 for 6/12)
}

export interface RightAngleResults {
  rise: number
  run: number
  diagonal: number
  pitch: number       // as decimal ratio
  pitchString: string // e.g. "6/12"
  angle: number       // degrees from horizontal
}

export function solveRightAngle(inputs: RightAngleInputs): RightAngleResults | null {
  const { rise, run, diagonal, pitch } = inputs

  let r: number | undefined
  let n: number | undefined
  let d: number | undefined

  // Resolve pitch to rise/run ratio if only pitch + one other
  if (pitch !== undefined && run !== undefined) {
    r = pitch * run
    n = run
  } else if (pitch !== undefined && rise !== undefined) {
    r = rise
    n = rise / pitch
  } else if (rise !== undefined && run !== undefined) {
    r = rise
    n = run
  } else if (rise !== undefined && diagonal !== undefined) {
    r = rise
    d = diagonal
    const runSq = d * d - r * r
    if (runSq < 0) return null
    n = Math.sqrt(runSq)
  } else if (run !== undefined && diagonal !== undefined) {
    n = run
    d = diagonal
    const riseSq = d * d - n * n
    if (riseSq < 0) return null
    r = Math.sqrt(riseSq)
  } else if (pitch !== undefined && diagonal !== undefined) {
    // pitch = r/n, d = sqrt(r²+n²)
    // r = pitch*n → d = n*sqrt(pitch²+1)
    n = diagonal / Math.sqrt(pitch * pitch + 1)
    r = pitch * n
    d = diagonal
  } else {
    return null
  }

  if (r === undefined || n === undefined) return null
  if (n === 0 && r === 0) return null

  const computedDiag = d ?? Math.sqrt(r * r + n * n)
  const pitchRatio = n !== 0 ? r / n : 0
  const pitchPer12 = pitchRatio * 12
  const angle = (Math.atan2(r, n) * 180) / Math.PI

  // Express pitch as X/12 with nearest 1/8
  const pitchRounded = Math.round(pitchPer12 * 8) / 8
  const pitchStr = `${pitchRounded.toFixed(pitchRounded % 1 === 0 ? 0 : 3)}/12`

  return {
    rise: r,
    run: n,
    diagonal: computedDiag,
    pitch: pitchRatio,
    pitchString: pitchStr,
    angle,
  }
}
