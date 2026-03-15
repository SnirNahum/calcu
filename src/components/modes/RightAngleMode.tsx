import type { Dispatch } from 'react'
import type { Action, CalculatorState } from '../../types'

interface Props {
  state: CalculatorState
  dispatch: Dispatch<Action>
}

// Simple SVG right-triangle diagram
function TriangleDiagram({
  rise,
  run,
  diag,
  pitch,
}: {
  rise?: number
  run?: number
  diag?: number
  pitch?: string
}) {
  return (
    <svg viewBox="0 0 120 80" className="w-28 h-20 flex-shrink-0">
      <polygon points="10,70 110,70 110,10" fill="none" stroke="#475569" strokeWidth="1.5" />
      {/* Right angle mark */}
      <polyline points="110,22 98,22 98,70" fill="none" stroke="#64748b" strokeWidth="1" />
      {/* Labels */}
      <text x="60" y="78" textAnchor="middle" fill={run ? '#f97316' : '#64748b'} fontSize="9" fontFamily="monospace">
        Run
      </text>
      <text x="116" y="44" textAnchor="start" fill={rise ? '#f97316' : '#64748b'} fontSize="9" fontFamily="monospace">
        Rise
      </text>
      <text x="52" y="36" textAnchor="middle" fill={diag ? '#f97316' : '#64748b'} fontSize="9" fontFamily="monospace" transform="rotate(-37,52,36)">
        Diag
      </text>
      {pitch && (
        <text x="30" y="66" fill="#fbbf24" fontSize="8" fontFamily="monospace">
          {pitch}
        </text>
      )}
    </svg>
  )
}

export default function RightAngleMode({ state, dispatch }: Props) {
  const [riseInp, runInp, diagInp, pitchInp] = state.inputs

  return (
    <div className="bg-slate-800/30 border-b border-slate-700 px-3 py-2">
      <div className="flex gap-3 items-start">
        <TriangleDiagram
          rise={riseInp?.value ?? undefined}
          run={runInp?.value ?? undefined}
          diag={diagInp?.value ?? undefined}
          pitch={pitchInp?.raw || undefined}
        />
        <div className="flex-1 text-xs text-slate-400 space-y-0.5">
          <p className="text-slate-300 font-medium mb-1">Enter any 2 of 4 values</p>
          <p>• Rise: vertical height</p>
          <p>• Run: horizontal distance</p>
          <p>• Diagonal: hypotenuse / rafter</p>
          <p>• Pitch: e.g. <span className="text-amber-300">6</span> for 6/12</p>
        </div>
      </div>
    </div>
  )
}
