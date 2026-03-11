import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface UniqueValuesPoint {
  round: number
  senders: number
  receivers: number
  apps: number
  assets: number
}

export function useUniqueValues(blocks: Map<number, BlockData>, count = 50): UniqueValuesPoint[] {
  return useMemo(() => {
    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    return sorted.slice(-count).map((b) => ({
      round: b.round,
      senders: b.uniqueSenders,
      receivers: b.uniqueReceivers,
      apps: b.uniqueAppIds,
      assets: b.uniqueAssetIds,
    }))
  }, [blocks, count])
}
