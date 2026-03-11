import { useBlockTime } from '../../hooks/useBlockTime'
import { useProposers } from '../../hooks/useProposers'
import { useProposersOverTime } from '../../hooks/useProposersOverTime'
import { useProtocolStatus } from '../../hooks/useProtocolStatus'
import { useSupply } from '../../hooks/useSupply'
import { StatPanel } from './StatPanel'
import { StakePanel } from './StakePanel'
import { StakeGauge } from './StakeGauge'
import { ProtocolPanel } from './ProtocolPanel'
import { ProposerChart } from './ProposerChart'
import { ProposersOverTimeChart } from './ProposersOverTimeChart'
import { TheoreticalValuesTable } from './TheoreticalValuesTable'
import { StakingCalculator } from './StakingCalculator'
import type { BlockData } from '../../types/dashboard'

interface NetworkDashboardProps {
  latestRound: number | null
  blocks: Map<number, BlockData>
}

export function NetworkDashboard({ latestRound, blocks }: NetworkDashboardProps) {
  const blockTime = useBlockTime(blocks)
  const { proposers, uniqueCount } = useProposers(blocks)
  const proposersOverTime = useProposersOverTime(blocks)
  const protocolStatus = useProtocolStatus()
  const supply = useSupply()

  const totalProposed = proposers.reduce((s, p) => s + p.count, 0)

  return (
    <div className="space-y-4">
      {/* Row 1: Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPanel title="Latest Block" value={latestRound !== null ? latestRound.toLocaleString() : null} color="info" />
        <StatPanel title="Avg Block Time" value={blockTime !== null ? `${blockTime.toFixed(2)}s` : null} subtitle="100-block average" color="secondary" />
        <StatPanel title="Unique Proposers" value={uniqueCount > 0 ? uniqueCount : null} subtitle={`last ${totalProposed} blocks`} color="primary" />
        <StakePanel supply={supply} />
      </div>

      {/* Row 2: Protocol + Stake gauge + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProtocolPanel status={protocolStatus} />
        <StakeGauge supply={supply} />
        <StakingCalculator supply={supply} blockTime={blockTime} />
      </div>

      {/* Row 3: Theoretical values + Proposers over time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TheoreticalValuesTable supply={supply} blockTime={blockTime} />
        <ProposersOverTimeChart data={proposersOverTime} />
      </div>

      {/* Row 4: Proposer distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProposerChart data={proposers} />
        <div className="bg-base-200 rounded-box shadow p-4">
          <h3 className="text-sm font-semibold mb-2 opacity-60">Top Proposers (cached blocks)</h3>
          {proposers.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
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
                  {proposers.slice(0, 20).map((p, i) => (
                    <tr key={p.address}>
                      <td>{i + 1}</td>
                      <td className="font-mono text-xs">{`${p.address.slice(0, 6)}...${p.address.slice(-4)}`}</td>
                      <td>{p.count}</td>
                      <td>{((p.count / totalProposed) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
