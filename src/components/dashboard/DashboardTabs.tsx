import { useState } from 'react'
import { useLatestBlock } from '../../hooks/useLatestBlock'
import { useBlockCache } from '../../hooks/useBlockCache'
import { Dashboard } from './Dashboard'
import { BlocksDashboard } from './BlocksDashboard'
import { TransactionsDashboard } from './TransactionsDashboard'
import { NetworkDashboard } from './NetworkDashboard'
import { ExplorerDashboard } from './ExplorerDashboard'
import { UnavailableDashboard } from './UnavailableDashboard'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'blocks', label: 'Blocks' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'consensus', label: 'Consensus' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'unavailable', label: 'Unavailable' },
] as const

type TabId = (typeof tabs)[number]['id']

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const latestRound = useLatestBlock()
  const blocks = useBlockCache(latestRound)

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Algorand Mainnet Dashboard</h1>

      <div className="overflow-x-auto mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div role="tablist" className="tabs tabs-bordered min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              className={`tab tab-sm sm:tab-lg whitespace-nowrap ${activeTab === tab.id ? 'tab-active font-semibold' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && <Dashboard latestRound={latestRound} blocks={blocks} />}
      {activeTab === 'blocks' && <BlocksDashboard latestRound={latestRound} blocks={blocks} />}
      {activeTab === 'transactions' && <TransactionsDashboard blocks={blocks} />}
      {activeTab === 'consensus' && <NetworkDashboard latestRound={latestRound} blocks={blocks} />}
      {activeTab === 'explorer' && <ExplorerDashboard blocks={blocks} />}
      {activeTab === 'unavailable' && <UnavailableDashboard />}
    </div>
  )
}
