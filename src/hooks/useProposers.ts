import { useEffect, useRef, useState } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export interface ProposerEntry {
  address: string
  count: number
}

const BLOCK_WINDOW = 100

export function useProposers(latestRound: number | null) {
  const { algod } = useAlgoClients()
  const [proposers, setProposers] = useState<ProposerEntry[]>([])
  const [uniqueCount, setUniqueCount] = useState(0)
  const fetchedRef = useRef<Set<number>>(new Set())
  const proposerMapRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    if (latestRound === null) return

    const startRound = Math.max(1, latestRound - BLOCK_WINDOW + 1)

    const fetchNew = async () => {
      const promises: Promise<void>[] = []

      for (let r = startRound; r <= latestRound; r++) {
        if (fetchedRef.current.has(r)) continue
        fetchedRef.current.add(r)

        promises.push(
          algod
            .block(r)
            .do()
            .then((block) => {
              const proposer = String(block.block.header.proposer ?? 'unknown')
              const map = proposerMapRef.current
              map.set(proposer, (map.get(proposer) ?? 0) + 1)
            })
            .catch(() => {
              fetchedRef.current.delete(r)
            }),
        )
      }

      if (promises.length === 0) return
      await Promise.all(promises)

      // Evict old rounds
      const toKeep = new Set<number>()
      for (let r = startRound; r <= latestRound; r++) toKeep.add(r)
      for (const r of fetchedRef.current) {
        if (!toKeep.has(r)) fetchedRef.current.delete(r)
      }

      const map = proposerMapRef.current
      const sorted = Array.from(map.entries())
        .map(([address, count]) => ({ address, count }))
        .sort((a, b) => b.count - a.count)

      setProposers(sorted)
      setUniqueCount(sorted.length)
    }

    fetchNew()
  }, [algod, latestRound])

  return { proposers, uniqueCount }
}
