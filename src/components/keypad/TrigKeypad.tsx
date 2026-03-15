import type { Dispatch } from 'react'
import type { Action, AngleUnit } from '../../types'
import KeypadButton from './KeypadButton'

interface Props {
  dispatch: Dispatch<Action>
  angleUnit: AngleUnit
}

export default function TrigKeypad({ dispatch, angleUnit }: Props) {
  const trig = (fn: string) => dispatch({ type: 'SET_TRIG_FN', payload: fn })

  return (
    <div className="border-b border-slate-700">
      <div className="grid grid-cols-3 gap-1.5 p-2 pb-1">
        <KeypadButton variant="trig" onClick={() => trig('sin')}>sin</KeypadButton>
        <KeypadButton variant="trig" onClick={() => trig('cos')}>cos</KeypadButton>
        <KeypadButton variant="trig" onClick={() => trig('tan')}>tan</KeypadButton>
        <KeypadButton variant="trig" onClick={() => trig('asin')}>sin⁻¹</KeypadButton>
        <KeypadButton variant="trig" onClick={() => trig('acos')}>cos⁻¹</KeypadButton>
        <KeypadButton variant="trig" onClick={() => trig('atan')}>tan⁻¹</KeypadButton>
      </div>
      <div className="flex justify-between items-center px-3 pb-2">
        <span className="text-slate-400 text-xs">Angle mode:</span>
        <div className="flex gap-1">
          {(['degrees', 'radians'] as AngleUnit[]).map((u) => (
            <button
              key={u}
              onClick={() => dispatch({ type: 'SET_ANGLE_UNIT', payload: u })}
              className={[
                'px-2 py-1 rounded text-xs font-mono transition-colors',
                angleUnit === u
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600',
              ].join(' ')}
            >
              {u === 'degrees' ? 'DEG' : 'RAD'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
