import { Copy } from 'lucide-react'
import type { ResultItem, DisplayUnit } from '../../types'
import {
  formatFeetInches,
  formatDecimalFeet,
  formatMetric,
  formatDegrees,
  formatSquareFeet,
  formatCubicFeet,
  formatDollars,
  formatCount,
} from '../../lib/dimensionalFormatter'

interface Props {
  item: ResultItem
  displayUnit: DisplayUnit
}

function formatValue(item: ResultItem, displayUnit: DisplayUnit): string {
  const { value, unit, secondary } = item

  if (unit === 'degrees') return formatDegrees(value)
  if (unit === 'squareFeet') {
    if (secondary === 'yd²') return `${(value).toFixed(3)} yd²`
    if (secondary === 'm²') return `${value.toFixed(3)} m²`
    return formatSquareFeet(value)
  }
  if (unit === 'cubicFeet') {
    if (secondary === 'yd³') return `${value.toFixed(3)} yd³`
    if (secondary === 'gal') return `${value.toFixed(1)} gal`
    return formatCubicFeet(value)
  }
  if (unit === 'dollars') return formatDollars(value)
  if (unit === 'count') return formatCount(value)
  if (unit === 'none') {
    if (secondary) return `${value.toFixed(4)} ${secondary}`
    return value.toFixed(4)
  }
  if (unit === 'feet') {
    switch (displayUnit) {
      case 'feet-inches': return formatFeetInches(value)
      case 'decimal-feet': return formatDecimalFeet(value)
      case 'metric': return formatMetric(value)
    }
  }
  return value.toFixed(4)
}

function getSecondaryValues(item: ResultItem, displayUnit: DisplayUnit): string[] {
  if (item.unit !== 'feet') return []
  const others: DisplayUnit[] = ['feet-inches', 'decimal-feet', 'metric']
  return others
    .filter((u) => u !== displayUnit)
    .map((u): string => {
      switch (u) {
        case 'feet-inches': return formatFeetInches(item.value)
        case 'decimal-feet': return formatDecimalFeet(item.value)
        case 'metric': return formatMetric(item.value)
        default: return ''
      }
    })
    .filter(Boolean)
}

export default function ResultCard({ item, displayUnit }: Props) {
  const primary = formatValue(item, displayUnit)
  const secondaries = getSecondaryValues(item, displayUnit)

  const copyText = [primary, ...secondaries].join(' · ')

  return (
    <div className="bg-slate-800 border-l-4 border-orange-500 rounded-r-lg px-3 py-2 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs mb-0.5 truncate">{item.label}</p>
          <p className="font-mono text-lg font-semibold text-orange-300 truncate">{primary}</p>
          {secondaries.length > 0 && (
            <p className="font-mono text-xs text-slate-500 mt-0.5 truncate">
              {secondaries.join(' · ')}
            </p>
          )}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(copyText).catch(() => {})}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-slate-500 hover:text-slate-300"
          title="Copy"
        >
          <Copy size={12} />
        </button>
      </div>
    </div>
  )
}
