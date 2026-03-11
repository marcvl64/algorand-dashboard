import type { BlockStats } from '../../hooks/useBlockStats'

interface BlockStatsTableProps {
  stats: BlockStats | null
}

export function BlockStatsTable({ stats }: BlockStatsTableProps) {
  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">TX per Block Stats</h3>
      {!stats ? (
        <div className="flex items-center justify-center h-32">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="opacity-60">Total Transactions</td>
                <td className="font-semibold text-right">{stats.totalTxns.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="opacity-60">Blocks Analyzed</td>
                <td className="font-semibold text-right">{stats.totalBlocks.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="opacity-60">Avg TX / Block</td>
                <td className="font-semibold text-right">{stats.avgTxns.toFixed(1)}</td>
              </tr>
              <tr>
                <td className="opacity-60">Median TX / Block</td>
                <td className="font-semibold text-right">{stats.medianTxns.toFixed(1)}</td>
              </tr>
              <tr>
                <td className="opacity-60">Min TX / Block</td>
                <td className="font-semibold text-right">{stats.minTxns}</td>
              </tr>
              <tr>
                <td className="opacity-60">Max TX / Block</td>
                <td className="font-semibold text-right">{stats.maxTxns}</td>
              </tr>
              <tr>
                <td className="opacity-60">95th Percentile</td>
                <td className="font-semibold text-right">{stats.p95Txns}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
