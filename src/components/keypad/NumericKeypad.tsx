import { Delete, RotateCcw } from 'lucide-react'
import KeypadButton from './KeypadButton'
import type { Action, Operator } from '../../types'
import type { Dispatch } from 'react'

interface Props {
  dispatch: Dispatch<Action>
  showOperators?: boolean
}

const OPERATORS: Operator[] = ['+', '-', '×', '÷']

export default function NumericKeypad({ dispatch, showOperators = false }: Props) {
  const press = (key: string) => dispatch({ type: 'KEY_PRESS', payload: key })
  const calc = () => dispatch({ type: 'CALCULATE' })
  const bksp = () => dispatch({ type: 'BACKSPACE' })
  const clear = () => dispatch({ type: 'CLEAR' })
  const op = (o: Operator) => dispatch({ type: 'SET_OPERATOR', payload: o })

  return (
    <div className="p-3 space-y-2">
      {/* Operator row — shown in all modes */}
      {showOperators && (
        <div className="grid grid-cols-4 gap-2">
          {OPERATORS.map((o) => (
            <KeypadButton key={o} variant="operator" onClick={() => op(o)}>
              {o}
            </KeypadButton>
          ))}
        </div>
      )}

      {/* Numeric grid */}
      <div className="grid grid-cols-4 gap-2">
        <KeypadButton onClick={() => press('7')}>7</KeypadButton>
        <KeypadButton onClick={() => press('8')}>8</KeypadButton>
        <KeypadButton onClick={() => press('9')}>9</KeypadButton>
        <KeypadButton variant="action" onClick={bksp}><Delete size={16} /></KeypadButton>

        <KeypadButton onClick={() => press('4')}>4</KeypadButton>
        <KeypadButton onClick={() => press('5')}>5</KeypadButton>
        <KeypadButton onClick={() => press('6')}>6</KeypadButton>
        <KeypadButton variant="action" onClick={clear}><RotateCcw size={14} /></KeypadButton>

        <KeypadButton onClick={() => press('1')}>1</KeypadButton>
        <KeypadButton onClick={() => press('2')}>2</KeypadButton>
        <KeypadButton onClick={() => press('3')}>3</KeypadButton>
        <KeypadButton variant="primary" tall onClick={calc}>=</KeypadButton>

        <KeypadButton onClick={() => press('0')} wide>0</KeypadButton>
        <KeypadButton onClick={() => press('.')}>.</KeypadButton>
      </div>
    </div>
  )
}
