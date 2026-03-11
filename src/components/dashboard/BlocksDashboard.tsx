import { useBlockTime } from '../../hooks/useBlockTime'
import { useBlockTimes } from '../../hooks/useBlockTimes'
import { useBlockTimeHistogram } from '../../hooks/useBlockTimeHistogram'
import { useBlockStats } from '../../hooks/useBlockStats'
import { useTxCounts } from '../../hooks/useTxCounts'
import { useTxBrackets } from '../../hooks/useTxBrackets'
import { StatPanel } from './StatPanel'
import { BlockTimeChart } from './BlockTimeChart'
import { BlockTimeHistogramChart } from './BlockTimeHistogramChart'
import { BlockStatsTable } from './BlockStatsTable'
import { TxBracketTable } from './TxBracketTable'
import { TxCountChart } from './TxCountChart'
import type { BlockData } from '../../types/dashboard'

interface BlocksDashboardProps {
  latestRound: number | null
  blocks: Map<number, BlockData>
}

export function BlocksDashboard({ latestRound, blocks }: BlocksDashboardProps) {
  const blockTime = useBlockTime(blocks)
  const blockTimes = useBlockTimes(blocks)
  const histogram = useBlockTimeHistogram(blocks)
  const blockStats = useBlockStats(blocks)
  const txCounts = useTxCounts(blocks, 30)
  const txBrackets = useTxBrackets(blocks)

  return (
    <div className="space-y-4">
      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPanel title="Latest Block" value={latestRound !== null ? latestRound.toLocaleString() : null} color="info" />
        <StatPanel title="Avg Block Time" value={blockTime !== null ? `${blockTime.toFixed(2)}s` : null} subtitle="100-block average" color="secondary" />
        <StatPanel title="Blocks Cached" value={blocks.size > 0 ? blocks.size : null} color="primary" />
        <StatPanel title="Total TX (cached)" value={blockStats ? blockStats.totalTxns.toLocaleString() : null} color="accent" />
      </div>

      {/* Row 2: Block time chart */}
      <BlockTimeChart data={blockTimes} avgBlockTime={blockTime} />

      {/* Row 3: Histogram + stats table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BlockTimeHistogramChart data={histogram} />
        <BlockStatsTable stats={blockStats} />
      </div>

      {/* Row 4: TX bracket + TX count chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <TxBracketTable data={txBrackets} />
        <div className="lg:col-span-3">
          <TxCountChart data={txCounts} />
        </div>
      </div>
    </div>
  )
}
