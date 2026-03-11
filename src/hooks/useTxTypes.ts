import { useMemo } from 'react'
import type { BlockData, TxType } from '../types/dashboard'

export interface TxTypeEntry {
  type: TxType
  count: number
}

export interface TxTypeOverTime {
  round: number
  pay: number
  axfer: number
  appl: number
  keyreg: number
  acfg: number
  afrz: number
  stpf: number
}

export function useTxTypeBreakdown(blocks: Map<number, BlockData>): TxTypeEntry[] {
  return useMemo(() => {
    const totals: Partial<Record<TxType, number>> = {}
    for (const block of blocks.values()) {
      for (const [type, count] of Object.entries(block.txnTypes)) {
        totals[type as TxType] = (totals[type as TxType] ?? 0) + count
      }
    }
    return Object.entries(totals)
      .map(([type, count]) => ({ type: type as TxType, count }))
      .sort((a, b) => b.count - a.count)
  }, [blocks])
}

export function useTxTypesOverTime(blocks: Map<number, BlockData>, count = 50): TxTypeOverTime[] {
  return useMemo(() => {
    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    return sorted.slice(-count).map((b) => ({
      round: b.round,
      pay: b.txnTypes.pay ?? 0,
      axfer: b.txnTypes.axfer ?? 0,
      appl: b.txnTypes.appl ?? 0,
      keyreg: b.txnTypes.keyreg ?? 0,
      acfg: b.txnTypes.acfg ?? 0,
      afrz: b.txnTypes.afrz ?? 0,
      stpf: b.txnTypes.stpf ?? 0,
    }))
  }, [blocks, count])
}
