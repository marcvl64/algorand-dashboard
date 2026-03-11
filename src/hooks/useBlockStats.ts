import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface BlockStats {
  totalBlocks: number
  totalTxns: number
  minTxns: number
  maxTxns: number
  avgTxns: number
  medianTxns: number
}

export function useBlockStats(blocks: Map<number, BlockData>): BlockStats | null {
  return useMemo(() => {
    if (blocks.size === 0) return null

    const txnCounts = Array.from(blocks.values())
      .map((b) => b.txnCount)
      .sort((a, b) => a - b)

    const total = txnCounts.reduce((s, c) => s + c, 0)
    const mid = Math.floor(txnCounts.length / 2)
    const median = txnCounts.length % 2 === 0 ? (txnCounts[mid - 1] + txnCounts[mid]) / 2 : txnCounts[mid]

    return {
      totalBlocks: blocks.size,
      totalTxns: total,
      minTxns: txnCounts[0],
      maxTxns: txnCounts[txnCounts.length - 1],
      avgTxns: total / txnCounts.length,
      medianTxns: median,
    }
  }, [blocks])
}
