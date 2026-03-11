import type { SupplyData } from '../../hooks/useSupply'

interface StakePanelProps {
  supply: SupplyData | null
}

function formatAlgo(microAlgos: number): string {
  const algo = microAlgos / 1_000_000
  if (algo >= 1_000_000_000) return `${(algo / 1_000_000_000).toFixed(2)}B`
  if (algo >= 1_000_000) return `${(algo / 1_000_000).toFixed(2)}M`
  return algo.toLocaleString()
}

export function StakePanel({ supply }: StakePanelProps) {
  if (!supply) {
    return (
      <div className="stat bg-base-200 rounded-box shadow">
        <div className="stat-title">Online Stake</div>
        <div className="stat-value">
          <span className="loading loading-dots loading-sm" />
        </div>
      </div>
    )
  }

  const pct = ((supply.onlineStake / supply.totalStake) * 100).toFixed(1)

  return (
    <div className="stat bg-base-200 rounded-box shadow">
      <div className="stat-title">Online Stake</div>
      <div className="stat-value text-accent">{formatAlgo(supply.onlineStake)}</div>
      <div className="stat-desc">
        {pct}% of {formatAlgo(supply.totalStake)} total
      </div>
    </div>
  )
}
