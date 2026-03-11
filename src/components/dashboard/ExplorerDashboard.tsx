import { useTopApps } from '../../hooks/useTopApps'
import { AccountLookup } from './AccountLookup'
import { AssetLookup } from './AssetLookup'
import { AppLookup } from './AppLookup'
import { TopAppsTable } from './TopAppsTable'
import type { BlockData } from '../../types/dashboard'

interface ExplorerDashboardProps {
  blocks: Map<number, BlockData>
}

export function ExplorerDashboard({ blocks }: ExplorerDashboardProps) {
  const topApps = useTopApps(blocks)

  return (
    <div className="space-y-4">
      {/* Row 1: Lookups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AccountLookup />
        <AssetLookup />
      </div>

      {/* Row 2: App lookup + Top apps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppLookup />
        <TopAppsTable data={topApps} />
      </div>
    </div>
  )
}
