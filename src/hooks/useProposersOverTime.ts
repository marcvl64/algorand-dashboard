import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface ProposersOverTimePoint {
  round: number
  uniqueProposers: number
}

export function useProposersOverTime(blocks: Map<number, BlockData>, windowSize = 20): ProposersOverTimePoint[] {
  return useMemo(() => {
    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    if (sorted.length < windowSize) return []

    const points: ProposersOverTimePoint[] = []
    for (let i = windowSize - 1; i < sorted.length; i++) {
      const window = sorted.slice(i - windowSize + 1, i + 1)
      const unique = new Set(window.map((b) => b.proposer).filter(Boolean))
      points.push({
        round: sorted[i].round,
        uniqueProposers: unique.size,
      })
    }
    return points
  }, [blocks, windowSize])
}
