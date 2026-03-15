import type { AngleUnit } from '../../types'

interface Props {
  angleUnit: AngleUnit
}

export default function TrigModeInfo({ angleUnit }: Props) {
  return (
    <div className="bg-slate-800/30 border-b border-slate-700 px-3 py-2">
      <div className="text-xs text-slate-400 space-y-0.5">
        <p className="text-slate-300 font-medium">Trigonometry</p>
        <p>Input 1: Angle ({angleUnit === 'degrees' ? 'degrees' : 'radians'})</p>
        <p>Input 2: Trig value (–1 to 1)</p>
        <p className="text-emerald-400">sin/cos/tan: angle → value</p>
        <p className="text-emerald-400">sin⁻¹/cos⁻¹/tan⁻¹: value → angle</p>
      </div>
    </div>
  )
}
