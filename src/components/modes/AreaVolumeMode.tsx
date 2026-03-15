import type { Dispatch } from 'react'
import type { Action, CalculatorState, Shape2D, Shape3D } from '../../types'

interface Props {
  state: CalculatorState
  dispatch: Dispatch<Action>
}

const SHAPES_2D: Shape2D[] = ['rectangle', 'circle', 'triangle']
const SHAPES_3D: Shape3D[] = ['box', 'cylinder', 'cone']

const shape2DLabels: Record<Shape2D, string> = {
  rectangle: 'Rect',
  circle: 'Circle',
  triangle: 'Triangle',
}

const shape3DLabels: Record<Shape3D, string> = {
  box: 'Box',
  cylinder: 'Cylinder',
  cone: 'Cone',
}

const btnCls = (active: boolean) =>
  [
    'px-2.5 py-1.5 rounded text-xs font-mono transition-colors',
    active
      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
      : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600',
  ].join(' ')

export default function AreaVolumeMode({ state, dispatch }: Props) {
  const { calcDimension, shape2D, shape3D } = state

  return (
    <div className="bg-slate-800/30 border-b border-slate-700 px-3 py-2 space-y-2">
      {/* 2D / 3D toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'SET_CALC_DIMENSION', payload: '2d' })}
          className={btnCls(calcDimension === '2d')}
        >
          2D Area
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_CALC_DIMENSION', payload: '3d' })}
          className={btnCls(calcDimension === '3d')}
        >
          3D Volume
        </button>
      </div>

      {/* Shape selector */}
      <div className="flex gap-1.5 flex-wrap">
        {calcDimension === '2d'
          ? SHAPES_2D.map((s) => (
              <button
                key={s}
                onClick={() => dispatch({ type: 'SET_SHAPE_2D', payload: s })}
                className={btnCls(shape2D === s)}
              >
                {shape2DLabels[s]}
              </button>
            ))
          : SHAPES_3D.map((s) => (
              <button
                key={s}
                onClick={() => dispatch({ type: 'SET_SHAPE_3D', payload: s })}
                className={btnCls(shape3D === s)}
              >
                {shape3DLabels[s]}
              </button>
            ))}
      </div>

      {/* Dimension hints */}
      <p className="text-slate-500 text-xs font-mono">
        {calcDimension === '2d'
          ? shape2D === 'rectangle'
            ? 'Input: Width → Length'
            : shape2D === 'circle'
            ? 'Input: Radius'
            : 'Input: Base → Height'
          : shape3D === 'box'
          ? 'Input: W → L → H'
          : 'Input: Radius → Height'}
      </p>
    </div>
  )
}
