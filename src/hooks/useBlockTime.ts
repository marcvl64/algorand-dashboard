import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export function useBlockTime(blocks: Map<number, BlockData>, windowSize = 100): number | null {
  return useMemo(() => {
    if (blocks.size < 2) return null

    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    const window = sorted.slice(-windowSize)
    if (window.length < 2) return null

    const timeSpan = window[window.length - 1].timestamp - window[0].timestamp
    return timeSpan / (window.length - 1)
  }, [blocks, windowSize])
}
