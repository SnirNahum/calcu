import type { Dispatch } from 'react'
import type { Action } from '../../types'
import KeypadButton from './KeypadButton'

interface Props {
  dispatch: Dispatch<Action>
}

const FRACTIONS = ['1/2', '1/4', '3/4', '1/8', '3/8', '5/8', '7/8', '1/16', '3/16', '5/16', '7/16', '9/16']

export default function DimensionKeypad({ dispatch }: Props) {
  const press = (key: string) => dispatch({ type: 'KEY_PRESS', payload: key })

  return (
    <div className="border-b border-slate-700">
      {/* Unit markers */}
      <div className="grid grid-cols-3 gap-1.5 p-2 pb-1">
        <KeypadButton variant="operator" onClick={() => press("'")} className="text-lg">
          ft <span className="text-amber-200 text-xs ml-1">'</span>
        </KeypadButton>
        <KeypadButton variant="operator" onClick={() => press('"')} className="text-lg">
          in <span className="text-amber-200 text-xs ml-1">"</span>
        </KeypadButton>
        <KeypadButton variant="action" onClick={() => dispatch({ type: 'CLEAR_ALL' })}>
          AC
        </KeypadButton>
      </div>

      {/* Fraction buttons */}
      <div className="grid grid-cols-4 gap-1 px-2 pb-2">
        {FRACTIONS.map((f) => (
          <KeypadButton key={f} variant="fraction" onClick={() => press(f)} className="py-2 text-xs">
            {f}"
          </KeypadButton>
        ))}
      </div>
    </div>
  )
}
