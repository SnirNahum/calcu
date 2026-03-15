import { useReducer } from 'react'
import type { CalculatorState, Action, CalculatorMode, InputState } from '../types'
import { parseDimensional } from '../lib/dimensionalParser'
import { formatFeetInches } from '../lib/dimensionalFormatter'
import { solveRightAngle } from '../lib/calculators/rightAngle'
import { calcArea, calcVolume } from '../lib/calculators/areaVolume'
import { calculateStairs } from '../lib/calculators/stairs'
import { calcTrig, calcInverseTrig } from '../lib/calculators/trig'
import { calculateCost } from '../lib/calculators/costEstimator'

function makeInput(label: string): InputState {
  return { raw: '', value: null, label, isActive: false }
}

const modeInputs: Record<CalculatorMode, InputState[]> = {
  dimensional: [makeInput('Enter value')],
  'right-angle': [
    makeInput('Rise'),
    makeInput('Run'),
    makeInput('Diagonal'),
    makeInput('Pitch (/12)'),
  ],
  'area-volume': [
    makeInput('Width'),
    makeInput('Length / Height'),
    makeInput('Depth / Height'),
  ],
  stairs: [makeInput('Total Rise'), makeInput('Desired Riser (opt)')],
  trig: [makeInput('Angle'), makeInput('Value')],
  cost: [makeInput('Quantity'), makeInput('Unit Cost ($)'), makeInput('Waste %')],
}

function initialState(): CalculatorState {
  const inputs = modeInputs['dimensional'].map((inp, i) => ({ ...inp, isActive: i === 0 }))
  return {
    mode: 'dimensional',
    displayUnit: 'metric',
    angleUnit: 'degrees',
    activeInputIndex: 0,
    inputs,
    results: [],
    error: null,
    memory: null,
    operator: null,
    operandA: null,
    shape2D: 'rectangle',
    shape3D: 'box',
    calcDimension: '2d',
  }
}

function appendToRaw(raw: string, key: string): string {
  // Handle complete fraction keys like "3/4"
  if (/^\d+\/\d+$/.test(key)) {
    // After a feet marker "12'" → "12' 3/4"
    // After empty or just "'" → append directly so parseDimensional handles it as inches fraction
    if (raw === '') return key
    if (raw.endsWith("'")) return raw + ' ' + key
    // After whole inches "12'6" → "12'6 3/4"
    if (/\d$/.test(raw)) return raw + ' ' + key
    // After a space, just append
    return raw + key
  }
  return raw + key
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_MODE': {
      const inputs = modeInputs[action.payload].map((inp, i) => ({ ...inp, isActive: i === 0 }))
      return {
        ...state,
        mode: action.payload,
        inputs,
        results: [],
        error: null,
        activeInputIndex: 0,
        operator: null,
        operandA: null,
      }
    }

    case 'SET_DISPLAY_UNIT':
      return { ...state, displayUnit: action.payload }

    case 'SET_ANGLE_UNIT':
      return { ...state, angleUnit: action.payload }

    case 'SET_ACTIVE_INPUT': {
      const inputs = state.inputs.map((inp, i) => ({ ...inp, isActive: i === action.payload }))
      return { ...state, activeInputIndex: action.payload, inputs }
    }

    case 'KEY_PRESS': {
      const idx = state.activeInputIndex
      const inp = state.inputs[idx]
      if (!inp) return state

      const newRaw = appendToRaw(inp.raw, action.payload)
      const value = parseDimensional(newRaw)
      const newInputs = state.inputs.map((it, i) =>
        i === idx ? { ...it, raw: newRaw, value } : it,
      )
      // Clear previous results when user starts typing a new value
      return { ...state, inputs: newInputs, error: null, results: [] }
    }

    case 'BACKSPACE': {
      const idx = state.activeInputIndex
      const inp = state.inputs[idx]
      if (!inp) return state

      let newRaw = inp.raw
      // Remove last character (could be a space before fraction)
      if (newRaw.endsWith('"')) newRaw = newRaw.slice(0, -1)
      else if (/ \d+\/\d+$/.test(newRaw)) {
        // Remove trailing fraction like " 3/4"
        newRaw = newRaw.replace(/ \d+\/\d+$/, '')
      } else {
        newRaw = newRaw.slice(0, -1)
      }

      const value = parseDimensional(newRaw)
      const newInputs = state.inputs.map((it, i) =>
        i === idx ? { ...it, raw: newRaw, value } : it,
      )
      return { ...state, inputs: newInputs, error: null }
    }

    case 'CLEAR': {
      const idx = state.activeInputIndex
      const newInputs = state.inputs.map((it, i) =>
        i === idx ? { ...it, raw: '', value: null } : it,
      )
      return { ...state, inputs: newInputs, error: null }
    }

    case 'CLEAR_ALL': {
      const inputs = modeInputs[state.mode].map((inp, i) => ({ ...inp, isActive: i === 0 }))
      return {
        ...state,
        inputs,
        results: [],
        error: null,
        activeInputIndex: 0,
        operator: null,
        operandA: null,
      }
    }

    case 'SET_OPERATOR': {
      const inp = state.inputs[0]
      const currentVal = inp?.value ?? null
      const lastResult = state.results[0]?.unit === 'feet' ? state.results[0].value : null

      // If there's already a pending operation and a typed value, compute it first (chaining)
      let newOperandA: number | null = null
      if (state.operator !== null && state.operandA !== null && currentVal !== null) {
        switch (state.operator) {
          case '+': newOperandA = state.operandA + currentVal; break
          case '-': newOperandA = state.operandA - currentVal; break
          case '×': newOperandA = state.operandA * currentVal; break
          case '÷':
            if (currentVal === 0) {
              return { ...state, error: 'Cannot divide by zero' }
            }
            newOperandA = state.operandA / currentVal; break
        }
      } else {
        // No pending op — save current input, or fall back to last result for chaining after =
        newOperandA = currentVal ?? lastResult ?? state.operandA
      }

      const newInputs = state.inputs.map((it) => ({ ...it, raw: '', value: null }))
      // Only show running total when we actually chained (computed an intermediate result)
      const didCompute = state.operator !== null && state.operandA !== null && currentVal !== null
      const runningResults = didCompute && newOperandA !== null
        ? [{ label: 'Running total', value: newOperandA, unit: 'feet' as const }]
        : []

      return {
        ...state,
        operator: action.payload,
        operandA: newOperandA,
        inputs: newInputs,
        results: runningResults,
        error: null,
      }
    }

    case 'SET_SHAPE_2D':
      return {
        ...state,
        shape2D: action.payload,
        inputs: modeInputs['area-volume'].map((inp, i) => ({ ...inp, isActive: i === 0 })),
        results: [],
        error: null,
        activeInputIndex: 0,
      }

    case 'SET_SHAPE_3D':
      return {
        ...state,
        shape3D: action.payload,
        inputs: modeInputs['area-volume'].map((inp, i) => ({ ...inp, isActive: i === 0 })),
        results: [],
        error: null,
        activeInputIndex: 0,
      }

    case 'SET_CALC_DIMENSION':
      return {
        ...state,
        calcDimension: action.payload,
        inputs: modeInputs['area-volume'].map((inp, i) => ({ ...inp, isActive: i === 0 })),
        results: [],
        error: null,
        activeInputIndex: 0,
      }

    case 'MEMORY_STORE': {
      const inp = state.inputs[state.activeInputIndex]
      return { ...state, memory: inp?.value ?? state.memory }
    }

    case 'MEMORY_RECALL': {
      if (state.memory === null) return state
      const idx = state.activeInputIndex
      // Format as feet-inches string so it re-parses correctly
      const raw = formatFeetInches(state.memory)
      const newInputs = state.inputs.map((it, i) =>
        i === idx ? { ...it, raw, value: state.memory } : it,
      )
      return { ...state, inputs: newInputs, results: [] }
    }

    case 'MEMORY_CLEAR':
      return { ...state, memory: null }

    case 'SET_TRIG_FN': {
      return handleTrigFn(state, action.payload)
    }

    case 'CALCULATE': {
      return handleCalculate(state)
    }

    default:
      return state
  }
}

function handleTrigFn(state: CalculatorState, fn: string): CalculatorState {
  const angleInp = state.inputs[0]
  const valInp = state.inputs[1]

  const isFwd = ['sin', 'cos', 'tan'].includes(fn)
  const isInv = ['asin', 'acos', 'atan'].includes(fn)

  try {
    if (isFwd && angleInp.value !== null) {
      const result = calcTrig(fn as 'sin' | 'cos' | 'tan', angleInp.value, state.angleUnit)
      const newRaw = result.toFixed(6).replace(/\.?0+$/, '')
      const newInputs = state.inputs.map((it, i) =>
        i === 1 ? { ...it, raw: newRaw, value: result } : it,
      )
      return { ...state, inputs: newInputs, results: [], error: null }
    }
    if (isInv && valInp.value !== null) {
      const result = calcInverseTrig(fn as 'asin' | 'acos' | 'atan', valInp.value, state.angleUnit)
      const newRaw = result.toFixed(4).replace(/\.?0+$/, '')
      const newInputs = state.inputs.map((it, i) =>
        i === 0 ? { ...it, raw: newRaw, value: result } : it,
      )
      return { ...state, inputs: newInputs, results: [], error: null }
    }
  } catch {
    return { ...state, error: 'Invalid input for trig function' }
  }

  return state
}

function handleCalculate(state: CalculatorState): CalculatorState {
  const { mode, inputs, operator, operandA, shape2D, shape3D, calcDimension, angleUnit } = state

  try {
    switch (mode) {
      case 'dimensional': {
        const currentVal = inputs[0].value

        // Binary operation
        if (operator && operandA !== null) {
          if (currentVal === null) return { ...state, error: 'Enter second value' }
          let result: number
          switch (operator) {
            case '+': result = operandA + currentVal; break
            case '-': result = operandA - currentVal; break
            case '×': result = operandA * currentVal; break
            case '÷':
              if (currentVal === 0) return { ...state, error: 'Cannot divide by zero' }
              result = operandA / currentVal; break
            default: return state
          }
          return {
            ...state,
            results: [{ label: 'Result', value: result, unit: 'feet' }],
            operator: null,
            operandA: null,
            error: null,
          }
        }

        // No operator — show unit conversions of current value
        if (currentVal !== null) {
          return {
            ...state,
            results: [{ label: 'Value', value: currentVal, unit: 'feet' }],
            error: null,
          }
        }

        return { ...state, error: 'Enter a value' }
      }

      case 'right-angle': {
        const [riseInp, runInp, diagInp, pitchInp] = inputs
        const inputsObj: Record<string, number> = {}

        if (riseInp.value !== null) inputsObj['rise'] = riseInp.value
        if (runInp.value !== null) inputsObj['run'] = runInp.value
        if (diagInp.value !== null) inputsObj['diagonal'] = diagInp.value
        if (pitchInp.value !== null) inputsObj['pitch'] = pitchInp.value / 12

        if (Object.keys(inputsObj).length < 2) {
          return { ...state, error: 'Enter at least 2 values' }
        }

        const res = solveRightAngle(inputsObj)
        if (!res) return { ...state, error: 'Invalid combination' }

        return {
          ...state,
          error: null,
          results: [
            { label: 'Rise', value: res.rise, unit: 'feet' },
            { label: 'Run', value: res.run, unit: 'feet' },
            { label: 'Diagonal / Rafter', value: res.diagonal, unit: 'feet' },
            { label: 'Pitch', value: res.pitch * 12, unit: 'none', secondary: res.pitchString },
            { label: 'Angle', value: res.angle, unit: 'degrees' },
          ],
        }
      }

      case 'area-volume': {
        if (calcDimension === '2d') {
          const dims2d: number[] = []
          if (shape2D === 'rectangle') {
            const w = inputs[0].value
            const l = inputs[1].value
            if (w === null || l === null) return { ...state, error: 'Enter Width & Length' }
            dims2d.push(w, l)
          } else if (shape2D === 'circle') {
            const r = inputs[0].value
            if (r === null) return { ...state, error: 'Enter Radius' }
            dims2d.push(r)
          } else if (shape2D === 'triangle') {
            const b = inputs[0].value
            const h = inputs[1].value
            if (b === null || h === null) return { ...state, error: 'Enter Base & Height' }
            dims2d.push(b, h)
          }

          const res = calcArea(shape2D, dims2d)
          if (!res) return { ...state, error: 'Calculation failed' }

          return {
            ...state,
            error: null,
            results: [
              { label: 'Area', value: res.sqFt, unit: 'squareFeet' },
              { label: 'Square Yards', value: res.sqYards, unit: 'squareFeet', secondary: 'yd²' },
              { label: 'Square Meters', value: res.sqMeters, unit: 'squareFeet', secondary: 'm²' },
            ],
          }
        } else {
          // 3D
          const dims3d: number[] = []
          if (shape3D === 'box') {
            const w = inputs[0].value
            const l = inputs[1].value
            const h = inputs[2].value
            if (w === null || l === null || h === null) return { ...state, error: 'Enter W × L × H' }
            dims3d.push(w, l, h)
          } else if (shape3D === 'cylinder') {
            const r = inputs[0].value
            const h = inputs[1].value
            if (r === null || h === null) return { ...state, error: 'Enter Radius & Height' }
            dims3d.push(r, h)
          } else if (shape3D === 'cone') {
            const r = inputs[0].value
            const h = inputs[1].value
            if (r === null || h === null) return { ...state, error: 'Enter Radius & Height' }
            dims3d.push(r, h)
          }

          const res = calcVolume(shape3D, dims3d)
          if (!res) return { ...state, error: 'Calculation failed' }

          return {
            ...state,
            error: null,
            results: [
              { label: 'Volume', value: res.cuFt, unit: 'cubicFeet' },
              { label: 'Cubic Yards', value: res.cuYards, unit: 'cubicFeet', secondary: 'yd³' },
              { label: 'Gallons', value: res.gallons, unit: 'none', secondary: 'gal' },
            ],
          }
        }
      }

      case 'stairs': {
        const totalRise = inputs[0].value
        if (totalRise === null || totalRise <= 0) return { ...state, error: 'Enter Total Rise' }

        const desiredRiser = inputs[1].value ?? undefined
        const res = calculateStairs({ totalRise, desiredRiserHeight: desiredRiser ?? undefined })
        if (!res) return { ...state, error: 'Invalid stair dimensions' }

        return {
          ...state,
          error: null,
          results: [
            { label: 'Number of Steps', value: res.numberOfSteps, unit: 'count' },
            {
              label: `Riser Height ${res.riserOk ? '✓' : '⚠'}`,
              value: res.actualRiserHeight,
              unit: 'feet',
            },
            {
              label: `Tread Depth ${res.treadOk ? '✓' : '⚠'}`,
              value: res.actualTreadDepth,
              unit: 'feet',
            },
            { label: 'Total Run', value: res.totalRun, unit: 'feet' },
            { label: 'Stair Angle', value: res.stairAngle, unit: 'degrees' },
          ],
        }
      }

      case 'trig': {
        // Already handled by SET_TRIG_FN; = just shows current
        const a = inputs[0].value
        const v = inputs[1].value
        if (a === null && v === null) return { ...state, error: 'Enter an angle or value' }
        return state
      }

      case 'cost': {
        const qty = inputs[0].value
        const cost = inputs[1].value
        const waste = inputs[2].value

        if (qty === null || cost === null)
          return { ...state, error: 'Enter Quantity and Unit Cost' }

        const res = calculateCost({ quantity: qty, unitCost: cost, wasteFactor: waste ?? 0 })
        if (!res) return { ...state, error: 'Invalid values' }

        return {
          ...state,
          error: null,
          results: [
            { label: 'Net Quantity', value: res.netQuantity, unit: 'none' },
            { label: `Waste (${waste ?? 0}%)`, value: res.wasteQuantity, unit: 'none' },
            { label: 'Gross Quantity', value: res.grossQuantity, unit: 'none' },
            { label: 'Total Cost', value: res.totalCost, unit: 'dollars' },
          ],
        }
      }

      default:
        return state
    }
  } catch (err) {
    return { ...state, error: 'Calculation error' }
  }
}

export function useCalculatorState() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  return { state, dispatch }
}
