import { useEffect, useRef, useState } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export function useLatestBlock(pollMs = 4000) {
  const { algod } = useAlgoClients()
  const [latestRound, setLatestRound] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      try {
        const status = await algod.status().do()
        const round = Number(status.lastRound)
        if (!cancelled) setLatestRound(round)
      } catch (e) {
        console.error('Failed to poll status:', e)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, pollMs)

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [algod, pollMs])

  return latestRound
}
