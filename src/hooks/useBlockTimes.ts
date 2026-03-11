import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface BlockTimePoint {
  round: number
  blockTime: number
}

export function useBlockTimes(blocks: Map<number, BlockData>, count = 50): BlockTimePoint[] {
  return useMemo(() => {
    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    const window = sorted.slice(-count - 1) // need n+1 blocks to get n intervals

    if (window.length < 2) return []

    const points: BlockTimePoint[] = []
    for (let i = 1; i < window.length; i++) {
      points.push({
        round: window[i].round,
        blockTime: window[i].timestamp - window[i - 1].timestamp,
      })
    }
    return points
  }, [blocks, count])
}
