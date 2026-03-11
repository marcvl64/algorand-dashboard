import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export function useTxCounts(blocks: Map<number, BlockData>, count = 20): BlockData[] {
  return useMemo(() => {
    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    return sorted.slice(-count)
  }, [blocks, count])
}
