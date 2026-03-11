import { useCallback, useEffect, useRef, useState } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'
import type { BlockData, TxType } from '../types/dashboard'

const MAX_CACHE_SIZE = 300
const BOOTSTRAP_COUNT = 100
const BATCH_SIZE = 10

const VALID_TX_TYPES = new Set<TxType>(['pay', 'axfer', 'appl', 'keyreg', 'acfg', 'afrz', 'stpf'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePayset(payset: any[]): Pick<BlockData, 'txnTypes' | 'uniqueSenders' | 'uniqueReceivers' | 'uniqueAppIds' | 'uniqueAssetIds' | 'appIdCounts'> {
  const txnTypes: Partial<Record<TxType, number>> = {}
  const senders = new Set<string>()
  const receivers = new Set<string>()
  const appIds = new Set<number>()
  const assetIds = new Set<number>()
  const appIdCounts: Record<number, number> = {}

  for (const entry of payset) {
    const txn = entry?.signedTxn?.signedTxn?.txn
    if (txn == null) continue

    const raw = txn.type as string | undefined
    const type: TxType = raw && VALID_TX_TYPES.has(raw as TxType) ? (raw as TxType) : 'unknown'
    txnTypes[type] = (txnTypes[type] ?? 0) + 1

    if (txn.sender) senders.add(String(txn.sender))

    if (txn.payment?.receiver) receivers.add(String(txn.payment.receiver))
    if (txn.assetTransfer) {
      if (txn.assetTransfer.receiver) receivers.add(String(txn.assetTransfer.receiver))
      const aid = Number(txn.assetTransfer.assetIndex)
      if (aid > 0) assetIds.add(aid)
    }
    if (txn.applicationCall) {
      const aid = Number(txn.applicationCall.appIndex)
      if (aid > 0) {
        appIds.add(aid)
        appIdCounts[aid] = (appIdCounts[aid] ?? 0) + 1
      }
    }
    if (txn.assetConfig?.assetIndex) {
      assetIds.add(Number(txn.assetConfig.assetIndex))
    }
  }

  return {
    txnTypes,
    uniqueSenders: senders.size,
    uniqueReceivers: receivers.size,
    uniqueAppIds: appIds.size,
    uniqueAssetIds: assetIds.size,
    appIdCounts,
  }
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
        const parsed = parsePayset(payset)
        const data: BlockData = {
          round,
          timestamp: Number(block.block.header.timestamp),
          txnCount: payset.length,
          proposer: String(block.block.header.proposer ?? ''),
          ...parsed,
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
