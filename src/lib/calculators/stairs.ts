export interface StairInputs {
  totalRise: number         // decimal feet
  desiredRiserHeight?: number // decimal feet, default 7.5" = 0.625
}

export interface StairResults {
  numberOfSteps: number
  actualRiserHeight: number  // decimal feet
  actualTreadDepth: number   // decimal feet
  totalRun: number           // decimal feet
  stairAngle: number         // degrees
  riserOk: boolean           // IBC: 4" to 7.75"
  treadOk: boolean           // IBC: min 10"
}

const DEFAULT_RISER_FT = 7.5 / 12   // 7.5 inches
const MIN_RISER_FT = 4 / 12
const MAX_RISER_FT = 7.75 / 12
const MIN_TREAD_FT = 10 / 12

export function calculateStairs(inputs: StairInputs): StairResults | null {
  const { totalRise, desiredRiserHeight = DEFAULT_RISER_FT } = inputs

  if (totalRise <= 0 || desiredRiserHeight <= 0) return null

  const numberOfSteps = Math.max(1, Math.round(totalRise / desiredRiserHeight))
  const actualRiserHeight = totalRise / numberOfSteps

  // Ergonomic formula: riser + tread = 17.5"
  let actualTreadDepth = (17.5 / 12) - actualRiserHeight
  actualTreadDepth = Math.max(actualTreadDepth, MIN_TREAD_FT)

  const totalRun = actualTreadDepth * numberOfSteps
  const stairAngle = (Math.atan2(actualRiserHeight, actualTreadDepth) * 180) / Math.PI

  return {
    numberOfSteps,
    actualRiserHeight,
    actualTreadDepth,
    totalRun,
    stairAngle,
    riserOk: actualRiserHeight >= MIN_RISER_FT && actualRiserHeight <= MAX_RISER_FT,
    treadOk: actualTreadDepth >= MIN_TREAD_FT,
  }
}
