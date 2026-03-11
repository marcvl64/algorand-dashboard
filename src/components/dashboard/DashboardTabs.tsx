import { useState } from 'react'
import { useLatestBlock } from '../../hooks/useLatestBlock'
import { useBlockCache } from '../../hooks/useBlockCache'
import { Dashboard } from './Dashboard'
import { BlocksDashboard } from './BlocksDashboard'
import { TransactionsDashboard } from './TransactionsDashboard'
import { NetworkDashboard } from './NetworkDashboard'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'blocks', label: 'Blocks' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'consensus', label: 'Consensus & Network' },
] as const

type TabId = (typeof tabs)[number]['id']

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const latestRound = useLatestBlock()
  const blocks = useBlockCache(latestRound)

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Algorand Mainnet Dashboard</h1>

      <div role="tablist" className="tabs tabs-bordered mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className={`tab tab-lg ${activeTab === tab.id ? 'tab-active font-semibold' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <Dashboard latestRound={latestRound} blocks={blocks} />}
      {activeTab === 'blocks' && <BlocksDashboard latestRound={latestRound} blocks={blocks} />}
      {activeTab === 'transactions' && <TransactionsDashboard blocks={blocks} />}
      {activeTab === 'consensus' && <NetworkDashboard latestRound={latestRound} blocks={blocks} />}
    </div>
  )
}
