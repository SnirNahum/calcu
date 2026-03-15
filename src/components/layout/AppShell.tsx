import type { ReactNode } from 'react'
import { HardHat } from 'lucide-react'

interface Props {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-start justify-center">
      <div className="w-full max-w-sm min-h-screen flex flex-col bg-slate-900 shadow-2xl">
        {/* Header */}
        <header className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700 flex-shrink-0">
          <div className="p-1.5 bg-orange-500/20 rounded-lg">
            <HardHat size={18} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-100 leading-tight truncate">
              Refael's Calculator
            </h1>
            <p className="text-xs text-slate-500 leading-tight">Field Calculator</p>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
