import { useCallback, useEffect, useRef, useState } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'
import type { BlockData, TxType } from '../types/dashboard'

const MAX_CACHE_SIZE = 300
const BOOTSTRAP_COUNT = 100
const BATCH_SIZE = 10

const VALID_TX_TYPES = new Set<TxType>(['pay', 'axfer', 'appl', 'keyreg', 'acfg', 'afrz', 'stpf'])

function parseTxTypes(payset: unknown[]): Partial<Record<TxType, number>> {
  const counts: Partial<Record<TxType, number>> = {}
  for (const entry of payset) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (entry as any)?.signedTxn?.signedTxn?.txn?.type as string | undefined
    const type: TxType = raw && VALID_TX_TYPES.has(raw as TxType) ? (raw as TxType) : 'unknown'
    counts[type] = (counts[type] ?? 0) + 1
  }
  return counts
}

export function useBlockCache(latestRound: number | null) {
  const { algod } = useAlgoClients()
  const cacheRef = useRef<Map<number, BlockData>>(new Map())
  const [blocks, setBlocks] = useState<Map<number, BlockData>>(new Map())
  const bootstrappedRef = useRef(false)
  const fetchingRef = useRef<Set<number>>(new Set())

  const fetchBlock = useCallback(
    async (round: number): Promise<BlockData | null> => {
      if (cacheRef.current.has(round) || fetchingRef.current.has(round)) return cacheRef.current.get(round) ?? null
      fetchingRef.current.add(round)
      try {
        const block = await algod.block(round).do()
        const payset = block.block.payset ?? []
        const data: BlockData = {
          round,
          timestamp: Number(block.block.header.timestamp),
          txnCount: payset.length,
          proposer: String(block.block.header.proposer ?? ''),
          txnTypes: parseTxTypes(payset),
        }
        cacheRef.current.set(round, data)
        return data
      } catch (e) {
        console.error(`Failed to fetch block ${round}:`, e)
        return null
      } finally {
        fetchingRef.current.delete(round)
      }
    },
    [algod],
  )

  // Bootstrap: fetch last BOOTSTRAP_COUNT blocks
  useEffect(() => {
    if (latestRound === null || bootstrappedRef.current) return
    bootstrappedRef.current = true

    const startRound = latestRound - BOOTSTRAP_COUNT + 1

    const fetchBatch = async (start: number, end: number) => {
      const promises = []
      for (let r = start; r <= end; r++) {
        promises.push(fetchBlock(r))
      }
      await Promise.all(promises)
    }

    const bootstrap = async () => {
      for (let i = startRound; i <= latestRound; i += BATCH_SIZE) {
        const end = Math.min(i + BATCH_SIZE - 1, latestRound)
        await fetchBatch(i, end)
      }
      evictOld()
      setBlocks(new Map(cacheRef.current))
    }

    bootstrap()
  }, [latestRound, fetchBlock])

  // Fetch new blocks as latestRound advances
  useEffect(() => {
    if (latestRound === null || !bootstrappedRef.current) return

    const fetchNew = async () => {
      const cachedRounds = Array.from(cacheRef.current.keys())
      if (cachedRounds.length === 0) return
      const maxCached = Math.max(...cachedRounds)

      if (latestRound <= maxCached) return

      const promises = []
      for (let r = maxCached + 1; r <= latestRound; r++) {
        promises.push(fetchBlock(r))
      }
      await Promise.all(promises)
      evictOld()
      setBlocks(new Map(cacheRef.current))
    }

    fetchNew()
  }, [latestRound, fetchBlock])

  const evictOld = () => {
    const cache = cacheRef.current
    if (cache.size <= MAX_CACHE_SIZE) return
    const sorted = Array.from(cache.keys()).sort((a, b) => a - b)
    const toRemove = sorted.slice(0, cache.size - MAX_CACHE_SIZE)
    for (const r of toRemove) cache.delete(r)
  }

  return blocks
}
