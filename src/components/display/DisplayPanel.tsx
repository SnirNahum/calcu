import type { CalculatorState, Action } from '../../types'
import type { Dispatch } from 'react'
import ResultCard from './ResultCard'
import {
  formatFeetInches,
  formatDecimalFeet,
  formatMetric,
  formatDegrees,
  formatSquareFeet,
  formatCubicFeet,
  formatDollars,
  formatCount,
} from '../../lib/dimensionalFormatter'

interface Props {
  state: CalculatorState
  dispatch: Dispatch<Action>
}

function formatByUnit(value: number, displayUnit: CalculatorState['displayUnit']): string {
  switch (displayUnit) {
    case 'feet-inches': return formatFeetInches(value)
    case 'decimal-feet': return formatDecimalFeet(value)
    case 'metric': return formatMetric(value)
  }
}

function buildExpression(state: CalculatorState): string {
  const { inputs, activeInputIndex, operator, operandA, mode, displayUnit } = state
  const activeInput = inputs[activeInputIndex]

  if (mode === 'dimensional') {
    const raw = activeInput?.raw ?? ''
    return [state.expression, raw].filter(Boolean).join(' ')
  }

  // For multi-input modes, show all filled inputs
  return inputs
    .filter((inp) => inp.raw !== '')
    .map((inp) => `${inp.label}: ${inp.raw}`)
    .join('  ·  ')
}

function formatPrimaryResult(state: CalculatorState): string {
  const { results, displayUnit } = state
  if (results.length === 0) return ''

  const item = results[0]
  const { value, unit } = item

  if (unit === 'feet') {
    switch (displayUnit) {
      case 'feet-inches': return formatFeetInches(value)
      case 'decimal-feet': return formatDecimalFeet(value)
      case 'metric': return formatMetric(value)
    }
  }
  if (unit === 'degrees') return formatDegrees(value)
  if (unit === 'squareFeet') return formatSquareFeet(value)
  if (unit === 'cubicFeet') return formatCubicFeet(value)
  if (unit === 'dollars') return formatDollars(value)
  if (unit === 'count') return formatCount(value)
  if (unit === 'none') return item.secondary ? `${value.toFixed(4)} ${item.secondary}` : value.toFixed(4)
  return value.toFixed(4)
}

function getAltDisplay(state: CalculatorState): string {
  const { results, displayUnit } = state
  if (results.length === 0) return ''

  const item = results[0]
  if (item.unit !== 'feet') return ''

  const { value } = item
  switch (displayUnit) {
    case 'feet-inches':
      return `${formatDecimalFeet(value, 4)}  ·  ${formatMetric(value)}`
    case 'decimal-feet':
      return `${formatFeetInches(value)}  ·  ${formatMetric(value)}`
    case 'metric':
      return `${formatFeetInches(value)}  ·  ${formatDecimalFeet(value, 4)}`
    default:
      return ''
  }
}

export default function DisplayPanel({ state, dispatch }: Props) {
  const { inputs, activeInputIndex, displayUnit, results, error, memory } = state

  const expression = buildExpression(state)
  const primaryResult = formatPrimaryResult(state)
  const altDisplay = getAltDisplay(state)
  const hasResult = results.length > 0

  return (
    <div className="flex flex-col bg-slate-900 border-b border-slate-700">

      {/* Memory indicator */}
      {memory !== null && (
        <div className="px-3 pt-1.5 flex items-center gap-1">
          <span className="text-blue-400 text-xs font-mono bg-blue-900/30 px-1.5 py-0.5 rounded">
            M: {formatFeetInches(memory)}
          </span>
        </div>
      )}

      {/* Calculation / expression area */}
      <div className="px-3 pt-2 min-h-[2.5rem] flex items-start">
        <p className="font-mono text-sm text-slate-400 truncate w-full leading-snug">
          {expression || <span className="text-slate-600">—</span>}
        </p>
      </div>

      {/* Primary result display */}
      <div className="px-3 pb-1">
        <div className="flex items-baseline gap-1">
          <span className={[
            'font-mono font-semibold truncate transition-colors',
            hasResult ? 'text-4xl text-orange-400' : 'text-3xl text-slate-600',
          ].join(' ')}>
            {hasResult ? primaryResult : '0'}
          </span>
          {!hasResult && (
            <span className="font-mono text-3xl text-orange-400/50 animate-pulse">▮</span>
          )}
        </div>
        {/* Alt units — always rendered for fixed height */}
        <p className="font-mono text-xs text-slate-500 mt-1 h-4 truncate">
          {altDisplay}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-3 mb-2 px-2 py-1 bg-red-900/40 border border-red-700/50 rounded text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Extra results (cards for result 2+) */}
      {results.length > 1 && (
        <div className="px-2 pb-2 flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-none">
          {results.slice(1).map((item, i) => (
            <ResultCard key={`${item.label}-${i}`} item={item} displayUnit={displayUnit} />
          ))}
        </div>
      )}

      {/* Input tabs (when multiple inputs) */}
      {inputs.length > 1 && (
        <div className="flex gap-1 px-2 pb-2 overflow-x-auto scrollbar-none">
          {inputs.map((inp, i) => (
            <button
              key={i}
              onClick={() => dispatch({ type: 'SET_ACTIVE_INPUT', payload: i })}
              className={[
                'flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-mono transition-colors',
                i === activeInputIndex
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : inp.value !== null
                  ? 'bg-slate-700 text-slate-300 border border-slate-600'
                  : 'bg-slate-800 text-slate-500 border border-slate-700',
              ].join(' ')}
            >
              <span className="text-slate-500 text-xs mr-1">{inp.label}:</span>
              <span>{inp.raw || '—'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
