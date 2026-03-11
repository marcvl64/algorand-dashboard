import { useTps } from '../../hooks/useTps'
import { useTpsHistory } from '../../hooks/useTpsHistory'
import { useTxTypeBreakdown, useTxTypesOverTime } from '../../hooks/useTxTypes'
import { useBlockStats } from '../../hooks/useBlockStats'
import { TX_TYPE_LABELS, TX_TYPE_COLORS } from '../../types/dashboard'
import { StatPanel } from './StatPanel'
import { TpsChart } from './TpsChart'
import { TxTypeChart } from './TxTypeChart'
import { TxTypeStackedChart } from './TxTypeStackedChart'
import type { BlockData } from '../../types/dashboard'

interface TransactionsDashboardProps {
  blocks: Map<number, BlockData>
}

export function TransactionsDashboard({ blocks }: TransactionsDashboardProps) {
  const tps = useTps(blocks)
  const tpsHistory = useTpsHistory(tps)
  const txTypeBreakdown = useTxTypeBreakdown(blocks)
  const txTypesOverTime = useTxTypesOverTime(blocks)
  const blockStats = useBlockStats(blocks)

  const totalTx = txTypeBreakdown.reduce((s, e) => s + e.count, 0)

  return (
    <div className="space-y-4">
      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPanel title="TPS (100-block avg)" value={tps !== null ? tps.toFixed(2) : null} color="primary" />
        <StatPanel title="Total TX (cached)" value={blockStats ? blockStats.totalTxns.toLocaleString() : null} color="accent" />
        <StatPanel title="Avg TX / Block" value={blockStats ? blockStats.avgTxns.toFixed(1) : null} color="secondary" />
        <StatPanel title="Max TX / Block" value={blockStats ? blockStats.maxTxns.toLocaleString() : null} color="info" />
      </div>

      {/* Row 2: TPS time series */}
      <TpsChart data={tpsHistory} />

      {/* Row 3: TX type breakdown + table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TxTypeChart data={txTypeBreakdown} />
        <div className="bg-base-200 rounded-box shadow p-4">
          <h3 className="text-sm font-semibold mb-2 opacity-60">TX Type Breakdown</h3>
          {txTypeBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th className="text-right">Count</th>
                    <th className="text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {txTypeBreakdown.map((entry) => (
                    <tr key={entry.type}>
                      <td>
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                          style={{ backgroundColor: TX_TYPE_COLORS[entry.type] }}
                        />
                        {TX_TYPE_LABELS[entry.type]}
                      </td>
                      <td className="text-right font-mono">{entry.count.toLocaleString()}</td>
                      <td className="text-right font-mono">{((entry.count / totalTx) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Stacked area chart */}
      <TxTypeStackedChart data={txTypesOverTime} />
    </div>
  )
}
