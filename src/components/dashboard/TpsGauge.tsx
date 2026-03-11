interface TpsGaugeProps {
  peak: number
  maxScale?: number
}

export function TpsGauge({ peak, maxScale = 50 }: TpsGaugeProps) {
  const pct = Math.min((peak / maxScale) * 100, 100)
  const displayValue = peak > 0 ? peak.toFixed(1) : '--'

  return (
    <div className="bg-base-200 rounded-box shadow p-4 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Peak TPS (session)</h3>
      <div
        className="radial-progress text-primary"
        style={{ '--value': pct, '--size': '8rem', '--thickness': '0.6rem' } as React.CSSProperties}
        role="progressbar"
      >
        <span className="text-xl font-bold">{displayValue}</span>
      </div>
      <p className="text-xs opacity-40 mt-2">max scale: {maxScale} TPS</p>
    </div>
  )
}
