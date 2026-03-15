import type { Dispatch } from 'react'
import type { Action, CalculatorState, SpacingMeasurement } from '../../types'

interface Props {
  state: CalculatorState
  dispatch: Dispatch<Action>
}

const MEASUREMENT_OPTIONS: { value: SpacingMeasurement; label: string; description: string }[] = [
  { value: 'cc', label: 'C-C', description: 'Center to Center' },
  { value: 'ii', label: 'I-I', description: 'Inside to Inside' },
  { value: 'io', label: 'I-O', description: 'Inside to Outside' },
  { value: 'oi', label: 'O-I', description: 'Outside to Inside' },
  { value: 'oo', label: 'O-O', description: 'Outside to Outside' },
]

export default function SpacingMode({ state, dispatch }: Props) {
  const { spacingMeasurement, inputs, activeInputIndex } = state

  return (
    <div className="px-3 py-2 flex flex-col gap-2">
      {/* Measurement type selector */}
      <div>
        <p className="text-xs text-slate-500 mb-1.5 font-mono">Input measurement type</p>
        <div className="flex gap-1">
          {MEASUREMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch({ type: 'SET_SPACING_MEASUREMENT', payload: opt.value })}
              title={opt.description}
              className={[
                'flex-1 py-1.5 rounded text-xs font-mono font-semibold transition-colors',
                spacingMeasurement === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-1 font-mono text-center">
          {MEASUREMENT_OPTIONS.find((o) => o.value === spacingMeasurement)?.description}
        </p>
      </div>

      {/* Input tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
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
            <span>{inp.raw || (i === 1 ? '1.5"' : '—')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
