export default function CostMode() {
  return (
    <div className="bg-slate-800/30 border-b border-slate-700 px-3 py-2">
      <div className="text-xs text-slate-400 space-y-0.5">
        <p className="text-slate-300 font-medium">Material Cost Estimator</p>
        <p>Input 1: Net quantity (sq ft, LF, EA…)</p>
        <p>Input 2: Unit cost (dollars)</p>
        <p>Input 3: Waste factor % (0 = none)</p>
      </div>
    </div>
  )
}
