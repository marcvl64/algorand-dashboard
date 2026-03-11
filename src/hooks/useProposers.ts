import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface ProposerEntry {
  address: string
  count: number
}

export function useProposers(blocks: Map<number, BlockData>) {
  return useMemo(() => {
    const map = new Map<string, number>()
    for (const block of blocks.values()) {
      if (block.proposer) {
        map.set(block.proposer, (map.get(block.proposer) ?? 0) + 1)
      }
    }
    const proposers = Array.from(map.entries())
      .map(([address, count]) => ({ address, count }))
      .sort((a, b) => b.count - a.count)

    return { proposers, uniqueCount: proposers.length }
  }, [blocks])
}
