import type { Dispatch } from 'react'
import type { Action, CalculatorMode, AngleUnit } from '../../types'
import DimensionKeypad from './DimensionKeypad'
import TrigKeypad from './TrigKeypad'
import NumericKeypad from './NumericKeypad'

interface Props {
  dispatch: Dispatch<Action>
  mode: CalculatorMode
  angleUnit: AngleUnit
}

export default function Keypad({ dispatch, mode, angleUnit }: Props) {
  return (
    <div className="bg-slate-800/50 border-t border-slate-700">
      {mode === 'trig' && <TrigKeypad dispatch={dispatch} angleUnit={angleUnit} />}
      {mode === 'dimensional' && <DimensionKeypad dispatch={dispatch} />}
      <NumericKeypad dispatch={dispatch} />
    </div>
  )
}
