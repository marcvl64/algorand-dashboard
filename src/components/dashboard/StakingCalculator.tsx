import { useState } from 'react'
import type { SupplyData } from '../../hooks/useSupply'

interface StakingCalculatorProps {
  supply: SupplyData | null
  blockTime: number | null
}

export function StakingCalculator({ supply, blockTime }: StakingCalculatorProps) {
  const [stakeInput, setStakeInput] = useState('30000')

  if (supply == null || blockTime == null) {
    return (
      <div className="bg-base-200 rounded-box shadow p-4">
        <h3 className="text-sm font-semibold mb-2 opacity-60">Staking Calculator</h3>
        <span className="loading loading-dots loading-sm" />
      </div>
    )
  }

  const myStake = Number(stakeInput) || 0
  const onlineAlgo = supply.onlineStake / 1_000_000
  const fraction = myStake / onlineAlgo
  const blocksPerDay = (24 * 3600) / blockTime

  const proposalsPerDay = fraction * blocksPerDay
  const proposalsPerMonth = proposalsPerDay * 30

  // Probability of at least one proposal in N blocks: 1 - (1 - fraction)^N
  // Days until 95% chance: solve 1-(1-f)^(N*blocksPerDay) = 0.95
  const daysFor95 = fraction > 0 ? Math.log(1 - 0.95) / (Math.log(1 - fraction) * blocksPerDay) : Infinity
  const daysFor99 = fraction > 0 ? Math.log(1 - 0.99) / (Math.log(1 - fraction) * blocksPerDay) : Infinity

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Staking Calculator</h3>
      <div className="form-control mb-4">
        <label className="label py-1">
          <span className="label-text text-xs">Your stake (Algo)</span>
        </label>
        <input
          type="number"
          className="input input-bordered input-sm w-full"
          value={stakeInput}
          onChange={(e) => setStakeInput(e.target.value)}
          min={0}
        />
      </div>
      {myStake > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="opacity-60">Stake fraction</td>
                <td className="text-right font-mono">{(fraction * 100).toFixed(6)}%</td>
              </tr>
              <tr>
                <td className="opacity-60">Expected proposals/day</td>
                <td className="text-right font-mono">{proposalsPerDay.toFixed(3)}</td>
              </tr>
              <tr>
                <td className="opacity-60">Expected proposals/month</td>
                <td className="text-right font-mono">{proposalsPerMonth.toFixed(1)}</td>
              </tr>
              <tr>
                <td className="opacity-60">95% chance win within</td>
                <td className="text-right font-mono">{daysFor95 < 9999 ? `${daysFor95.toFixed(1)} days` : '—'}</td>
              </tr>
              <tr>
                <td className="opacity-60">99% chance win within</td>
                <td className="text-right font-mono">{daysFor99 < 9999 ? `${daysFor99.toFixed(1)} days` : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
