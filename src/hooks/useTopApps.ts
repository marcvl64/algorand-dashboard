import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface TopAppEntry {
  appId: number
  calls: number
}

export function useTopApps(blocks: Map<number, BlockData>, limit = 10): TopAppEntry[] {
  return useMemo(() => {
    const totals = new Map<number, number>()
    for (const block of blocks.values()) {
      for (const [appId, count] of Object.entries(block.appIdCounts)) {
        const id = Number(appId)
        totals.set(id, (totals.get(id) ?? 0) + count)
      }
    }
    return Array.from(totals.entries())
      .map(([appId, calls]) => ({ appId, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, limit)
  }, [blocks, limit])
}
