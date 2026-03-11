import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export function useTps(blocks: Map<number, BlockData>, windowSize = 100): number | null {
  return useMemo(() => {
    if (blocks.size < 2) return null

    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    const window = sorted.slice(-windowSize)
    if (window.length < 2) return null

    const totalTxns = window.reduce((sum, b) => sum + b.txnCount, 0)
    const timeSpan = window[window.length - 1].timestamp - window[0].timestamp
    if (timeSpan <= 0) return null

    return totalTxns / timeSpan
  }, [blocks, windowSize])
}
