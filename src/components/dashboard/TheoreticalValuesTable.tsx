import type { SupplyData } from '../../hooks/useSupply'

interface TheoreticalValuesTableProps {
  supply: SupplyData | null
  blockTime: number | null
}

export function TheoreticalValuesTable({ supply, blockTime }: TheoreticalValuesTableProps) {
  if (supply == null || blockTime == null) {
    return (
      <div className="bg-base-200 rounded-box shadow p-4">
        <h3 className="text-sm font-semibold mb-2 opacity-60">Theoretical Stake Values</h3>
        <div className="flex items-center justify-center h-32">
          <span className="loading loading-spinner loading-md" />
        </div>
      </div>
    )
  }

  const onlineAlgo = supply.onlineStake / 1_000_000
  const blocksPerHour = 3600 / blockTime

  // To propose once per interval: stake needed ≈ onlineStake / (blocks_in_interval)
  // This is an approximation: probability of proposing = stake / onlineStake per block
  const intervals = [
    { label: '1 hour', blocks: blocksPerHour },
    { label: '1 day', blocks: blocksPerHour * 24 },
    { label: '1 week', blocks: blocksPerHour * 24 * 7 },
    { label: '30 days', blocks: blocksPerHour * 24 * 30 },
  ]

  // Soft vote committee size ~2990, proposal committee ~20
  const softCommittee = 2990

  const rows = intervals.map((i) => ({
    frequency: i.label,
    algoToPropose: Math.ceil(onlineAlgo / i.blocks),
    algoToSoftVote: Math.ceil((onlineAlgo * softCommittee) / (i.blocks * 10000)),
  }))

  function formatAlgo(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString()
  }

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Theoretical Stake Values</h3>
      <p className="text-xs opacity-40 mb-3">Based on {formatAlgo(onlineAlgo)} online stake</p>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Frequency</th>
              <th className="text-right">Algo to Propose</th>
              <th className="text-right">Algo to Soft Vote</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.frequency}>
                <td>{r.frequency}</td>
                <td className="text-right font-mono">{formatAlgo(r.algoToPropose)}</td>
                <td className="text-right font-mono">{formatAlgo(r.algoToSoftVote)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
