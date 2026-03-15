import type { Dispatch } from 'react'
import type { Action, CalculatorState, Operator } from '../../types'
import KeypadButton from '../keypad/KeypadButton'

interface Props {
  state: CalculatorState
  dispatch: Dispatch<Action>
}

const OPERATORS: Operator[] = ['+', '-', '×', '÷']

export default function DimensionalMode({ state, dispatch }: Props) {
  return (
    <div className="bg-slate-800/30 border-b border-slate-700">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-slate-400 text-xs">Arithmetic</span>
        <div className="grid grid-cols-4 gap-1">
          {OPERATORS.map((op) => (
            <KeypadButton
              key={op}
              variant="operator"
              className={[
                'w-10 h-8 text-sm',
                state.operator === op ? 'ring-2 ring-amber-300' : '',
              ].join(' ')}
              onClick={() => dispatch({ type: 'SET_OPERATOR', payload: op })}
            >
              {op}
            </KeypadButton>
          ))}
        </div>
      </div>
      <div className="px-3 pb-2 flex gap-2">
        <button
          onClick={() => dispatch({ type: 'SET_DISPLAY_UNIT', payload: 'metric' })}
          className={btnCls(state.displayUnit === 'metric')}
        >
          metric
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_DISPLAY_UNIT', payload: 'feet-inches' })}
          className={btnCls(state.displayUnit === 'feet-inches')}
        >
          ft-in
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_DISPLAY_UNIT', payload: 'decimal-feet' })}
          className={btnCls(state.displayUnit === 'decimal-feet')}
        >
          dec ft
        </button>
        <div className="flex-1" />
        <button
          onClick={() => dispatch({ type: 'MEMORY_STORE' })}
          className={memBtnCls}
        >M+</button>
        <button
          onClick={() => dispatch({ type: 'MEMORY_RECALL' })}
          className={memBtnCls}
        >MR</button>
        <button
          onClick={() => dispatch({ type: 'MEMORY_CLEAR' })}
          className={memBtnCls}
        >MC</button>
      </div>
    </div>
  )
}

const btnCls = (active: boolean) =>
  [
    'px-2.5 py-1 rounded text-xs font-mono transition-colors',
    active
      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
      : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600',
  ].join(' ')

const memBtnCls =
  'px-2 py-1 rounded text-xs font-mono bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 transition-colors'
