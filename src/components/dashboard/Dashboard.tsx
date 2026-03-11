import { useLatestBlock } from '../../hooks/useLatestBlock'
import { useBlockCache } from '../../hooks/useBlockCache'
import { useTps } from '../../hooks/useTps'
import { useBlockTime } from '../../hooks/useBlockTime'
import { useTxCounts } from '../../hooks/useTxCounts'
import { useTpsHistory } from '../../hooks/useTpsHistory'
import { useTpsPeak } from '../../hooks/useTpsPeaks'
import { useSupply } from '../../hooks/useSupply'
import { StatPanel } from './StatPanel'
import { TpsChart } from './TpsChart'
import { TxCountChart } from './TxCountChart'
import { TpsGauge } from './TpsGauge'
import { StakePanel } from './StakePanel'
import { NavLinks } from './NavLinks'

export function Dashboard() {
  const latestRound = useLatestBlock()
  const blocks = useBlockCache(latestRound)
  const tps = useTps(blocks)
  const blockTime = useBlockTime(blocks)
  const txCounts = useTxCounts(blocks)
  const tpsHistory = useTpsHistory(tps)
  const tpsPeak = useTpsPeak(tpsHistory)
  const supply = useSupply()

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Algorand Mainnet Dashboard</h1>

      {/* Row 1: Stat panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatPanel title="TPS (100-block avg)" value={tps !== null ? tps.toFixed(2) : null} color="primary" />
        <StatPanel
          title="Block Time (100-block avg)"
          value={blockTime !== null ? `${blockTime.toFixed(2)}s` : null}
          color="secondary"
        />
        <StatPanel
          title="Latest Block"
          value={latestRound !== null ? latestRound.toLocaleString() : null}
          subtitle={blocks.size > 0 ? `${blocks.size} blocks cached` : undefined}
          color="info"
        />
        <StakePanel supply={supply} />
      </div>

      {/* Row 2: TPS chart + gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <div className="lg:col-span-3">
          <TpsChart data={tpsHistory} />
        </div>
        <TpsGauge peak={tpsPeak} />
      </div>

      {/* Row 3: TX count chart + nav links */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <TxCountChart data={txCounts} />
        </div>
        <NavLinks />
      </div>
    </div>
  )
}
