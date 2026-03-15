import { Ruler, Triangle, Square, DollarSign, Activity, AlignJustify } from 'lucide-react'
import type { CalculatorMode } from '../../types'

interface Props {
  mode: CalculatorMode
  onChange: (mode: CalculatorMode) => void
}

// Stair icon using SVG path
function StairIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,21 3,16 8,16 8,11 13,11 13,6 18,6 18,1 21,1" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  )
}

const TABS: { mode: CalculatorMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'dimensional', label: 'Dim', icon: <Ruler size={15} /> },
  { mode: 'right-angle', label: 'Roof', icon: <Triangle size={15} /> },
  { mode: 'area-volume', label: 'Area', icon: <Square size={15} /> },
  { mode: 'stairs', label: 'Stairs', icon: <StairIcon size={15} /> },
  { mode: 'trig', label: 'Trig', icon: <Activity size={15} /> },
  { mode: 'cost', label: 'Cost', icon: <DollarSign size={15} /> },
  { mode: 'spacing', label: 'Space', icon: <AlignJustify size={15} /> },
]

export default function ModeTabs({ mode, onChange }: Props) {
  return (
    <div className="flex bg-slate-900 border-b border-slate-700 overflow-x-auto scrollbar-none">
      {TABS.map((tab) => {
        const active = tab.mode === mode
        return (
          <button
            key={tab.mode}
            onClick={() => onChange(tab.mode)}
            className={[
              'flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 px-1 transition-colors',
              'border-b-2 text-xs font-medium',
              active
                ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50',
            ].join(' ')}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
