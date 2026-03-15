export type DecimalFeet = number

export type DisplayUnit = 'feet-inches' | 'decimal-feet' | 'metric'

export type CalculatorMode =
  | 'dimensional'
  | 'right-angle'
  | 'area-volume'
  | 'stairs'
  | 'trig'
  | 'cost'

export type AngleUnit = 'degrees' | 'radians'

export type Operator = '+' | '-' | '×' | '÷' | null

export interface InputState {
  raw: string
  value: DecimalFeet | null
  label: string
  isActive: boolean
}

export interface ResultItem {
  label: string
  value: number
  unit: 'feet' | 'degrees' | 'squareFeet' | 'cubicFeet' | 'dollars' | 'count' | 'inches' | 'none'
  secondary?: string
}

export interface CalculatorState {
  mode: CalculatorMode
  displayUnit: DisplayUnit
  angleUnit: AngleUnit
  activeInputIndex: number
  inputs: InputState[]
  results: ResultItem[]
  error: string | null
  memory: DecimalFeet | null
  operator: Operator
  operandA: DecimalFeet | null
  expression: string
  shape2D: Shape2D
  shape3D: Shape3D
  calcDimension: '2d' | '3d'
}

export type Shape2D = 'rectangle' | 'circle' | 'triangle'
export type Shape3D = 'box' | 'cylinder' | 'cone'

export type Action =
  | { type: 'SET_MODE'; payload: CalculatorMode }
  | { type: 'SET_DISPLAY_UNIT'; payload: DisplayUnit }
  | { type: 'SET_ANGLE_UNIT'; payload: AngleUnit }
  | { type: 'SET_ACTIVE_INPUT'; payload: number }
  | { type: 'KEY_PRESS'; payload: string }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ALL' }
  | { type: 'BACKSPACE' }
  | { type: 'MEMORY_STORE' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'SET_OPERATOR'; payload: Operator }
  | { type: 'SET_SHAPE_2D'; payload: Shape2D }
  | { type: 'SET_SHAPE_3D'; payload: Shape3D }
  | { type: 'SET_CALC_DIMENSION'; payload: '2d' | '3d' }
  | { type: 'SET_TRIG_FN'; payload: string }
