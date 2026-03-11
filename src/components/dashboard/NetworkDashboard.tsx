import { useLatestBlock } from '../../hooks/useLatestBlock'
import { useBlockCache } from '../../hooks/useBlockCache'
import { useBlockTime } from '../../hooks/useBlockTime'
import { useBlockTimes } from '../../hooks/useBlockTimes'
import { useProposers } from '../../hooks/useProposers'
import { useProtocolStatus } from '../../hooks/useProtocolStatus'
import { useSupply } from '../../hooks/useSupply'
import { StatPanel } from './StatPanel'
import { StakePanel } from './StakePanel'
import { StakeGauge } from './StakeGauge'
import { ProtocolPanel } from './ProtocolPanel'
import { ProposerChart } from './ProposerChart'
import { BlockTimeChart } from './BlockTimeChart'

export function NetworkDashboard() {
  const latestRound = useLatestBlock()
  const blocks = useBlockCache(latestRound)
  const blockTime = useBlockTime(blocks)
  const blockTimes = useBlockTimes(blocks)
  const { proposers, uniqueCount } = useProposers(latestRound)
  const protocolStatus = useProtocolStatus()
  const supply = useSupply()

  return (
    <div className="space-y-4">
      {/* Row 1: Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPanel
          title="Latest Block"
          value={latestRound !== null ? latestRound.toLocaleString() : null}
          color="info"
        />
        <StatPanel
          title="Avg Block Time"
          value={blockTime !== null ? `${blockTime.toFixed(2)}s` : null}
          subtitle="100-block average"
          color="secondary"
        />
        <StatPanel
          title="Unique Proposers"
          value={uniqueCount > 0 ? uniqueCount : null}
          subtitle="last 100 blocks"
          color="primary"
        />
        <StakePanel supply={supply} />
      </div>

      {/* Row 2: Protocol + Stake gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <ProtocolPanel status={protocolStatus} />
        </div>
        <StakeGauge supply={supply} />
        <div className="bg-base-200 rounded-box shadow p-4">
          <h3 className="text-sm font-semibold mb-3 opacity-60">Network Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="opacity-50">Network</span>
              <p className="font-semibold">Mainnet</p>
            </div>
            <div>
              <span className="opacity-50">API</span>
              <p className="font-mono text-xs">algonode.cloud</p>
            </div>
            <div>
              <span className="opacity-50">Blocks Cached</span>
              <p className="font-semibold">{blocks.size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Block time chart */}
      <BlockTimeChart data={blockTimes} avgBlockTime={blockTime} />

      {/* Row 4: Proposer distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProposerChart data={proposers} />
        <div className="bg-base-200 rounded-box shadow p-4">
          <h3 className="text-sm font-semibold mb-2 opacity-60">Top Proposers (last 100 blocks)</h3>
          {proposers.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Blocks</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {proposers.slice(0, 15).map((p, i) => {
                    const total = proposers.reduce((s, e) => s + e.count, 0)
                    return (
                      <tr key={p.address}>
                        <td>{i + 1}</td>
                        <td className="font-mono text-xs">{`${p.address.slice(0, 6)}...${p.address.slice(-4)}`}</td>
                        <td>{p.count}</td>
                        <td>{((p.count / total) * 100).toFixed(1)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
