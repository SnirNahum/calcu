export default function StairsMode() {
  return (
    <div className="bg-slate-800/30 border-b border-slate-700 px-3 py-2">
      <div className="flex items-start gap-3">
        {/* Stair icon SVG */}
        <svg viewBox="0 0 60 50" className="w-14 h-12 flex-shrink-0">
          <polyline
            points="0,50 0,40 10,40 10,30 20,30 20,20 30,20 30,10 40,10 40,0 60,0"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="0" y1="50" x2="60" y2="50" stroke="#475569" strokeWidth="1" />
        </svg>
        <div className="text-xs text-slate-400 space-y-0.5">
          <p className="text-slate-300 font-medium">Stair Calculator</p>
          <p>Input 1: Total rise (floor-to-floor)</p>
          <p>Input 2: Desired riser height (opt)</p>
          <p className="text-slate-500">IBC: Riser 4"–7¾", Tread min 10"</p>
        </div>
      </div>
    </div>
  )
}
