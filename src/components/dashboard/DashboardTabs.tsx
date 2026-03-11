import { useState } from 'react'
import { Dashboard } from './Dashboard'
import { NetworkDashboard } from './NetworkDashboard'

const tabs = [
  { id: 'mainnet', label: 'Mainnet TPS' },
  { id: 'network', label: 'Network Health' },
] as const

type TabId = (typeof tabs)[number]['id']

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('mainnet')

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

      {activeTab === 'mainnet' && <Dashboard />}
      {activeTab === 'network' && <NetworkDashboard />}
    </div>
  )
}
