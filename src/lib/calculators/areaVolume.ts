export type Shape2D = 'rectangle' | 'circle' | 'triangle'
export type Shape3D = 'box' | 'cylinder' | 'cone'

export interface AreaResult {
  sqFt: number
  sqYards: number
  sqMeters: number
}

export interface VolumeResult {
  cuFt: number
  cuYards: number
  cuMeters: number
  gallons: number
}

// dims in decimal feet
export function calcArea(shape: Shape2D, dims: number[]): AreaResult | null {
  let sqFt = 0

  if (shape === 'rectangle') {
    if (dims.length < 2 || dims[0] <= 0 || dims[1] <= 0) return null
    sqFt = dims[0] * dims[1]
  } else if (shape === 'circle') {
    if (dims.length < 1 || dims[0] <= 0) return null
    sqFt = Math.PI * dims[0] * dims[0]
  } else if (shape === 'triangle') {
    if (dims.length < 2 || dims[0] <= 0 || dims[1] <= 0) return null
    sqFt = 0.5 * dims[0] * dims[1]
  } else {
    return null
  }

  return {
    sqFt,
    sqYards: sqFt / 9,
    sqMeters: sqFt * 0.092903,
  }
}

export function calcVolume(shape: Shape3D, dims: number[]): VolumeResult | null {
  let cuFt = 0

  if (shape === 'box') {
    if (dims.length < 3 || dims.some((d) => d <= 0)) return null
    cuFt = dims[0] * dims[1] * dims[2]
  } else if (shape === 'cylinder') {
    if (dims.length < 2 || dims[0] <= 0 || dims[1] <= 0) return null
    cuFt = Math.PI * dims[0] * dims[0] * dims[1]
  } else if (shape === 'cone') {
    if (dims.length < 2 || dims[0] <= 0 || dims[1] <= 0) return null
    cuFt = (1 / 3) * Math.PI * dims[0] * dims[0] * dims[1]
  } else {
    return null
  }

  return {
    cuFt,
    cuYards: cuFt / 27,
    cuMeters: cuFt * 0.0283168,
    gallons: cuFt * 7.48052,
  }
}
