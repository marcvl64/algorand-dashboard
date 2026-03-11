import type { SupplyData } from '../../hooks/useSupply'

interface StakeGaugeProps {
  supply: SupplyData | null
}

export function StakeGauge({ supply }: StakeGaugeProps) {
  if (!supply) {
    return (
      <div className="bg-base-200 rounded-box shadow p-4 flex flex-col items-center justify-center">
        <h3 className="text-sm font-semibold mb-3 opacity-60">Online Stake</h3>
        <span className="loading loading-dots loading-md" />
      </div>
    )
  }

  const pct = (supply.onlineStake / supply.totalStake) * 100
  const displayPct = Math.min(pct, 100)

  return (
    <div className="bg-base-200 rounded-box shadow p-4 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Online Stake %</h3>
      <div
        className="radial-progress text-accent"
        style={{ '--value': displayPct, '--size': '8rem', '--thickness': '0.6rem' } as React.CSSProperties}
        role="progressbar"
      >
        <span className="text-xl font-bold">{pct.toFixed(1)}%</span>
      </div>
      <p className="text-xs opacity-40 mt-2">of total supply online</p>
    </div>
  )
}
