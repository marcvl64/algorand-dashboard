import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface TxBracket {
  range: string
  blocks: number
}

const BRACKETS: [number, number, string][] = [
  [0, 0, '0'],
  [1, 10, '1-10'],
  [11, 100, '11-100'],
  [101, 1000, '101-1000'],
  [1001, 5000, '1001-5000'],
  [5001, 10000, '5001-10000'],
  [10001, Infinity, '10001+'],
]

export function useTxBrackets(blocks: Map<number, BlockData>): TxBracket[] {
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const [, , label] of BRACKETS) counts.set(label, 0)

    for (const block of blocks.values()) {
      for (const [min, max, label] of BRACKETS) {
        if (block.txnCount >= min && block.txnCount <= max) {
          counts.set(label, (counts.get(label) ?? 0) + 1)
          break
        }
      }
    }

    return BRACKETS.map(([, , label]) => ({
      range: label,
      blocks: counts.get(label) ?? 0,
    })).filter((b) => b.blocks > 0)
  }, [blocks])
}
