import { useEffect, useRef, useState } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export interface SupplyData {
  onlineStake: number // in microAlgos
  totalStake: number // in microAlgos
}

export function useSupply(pollMs = 30000) {
  const { algod } = useAlgoClients()
  const [supply, setSupply] = useState<SupplyData | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      try {
        const result = await algod.supply().do()
        if (!cancelled) {
          setSupply({
            onlineStake: Number(result.onlineMoney),
            totalStake: Number(result.totalMoney),
          })
        }
      } catch (e) {
        console.error('Failed to fetch supply:', e)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, pollMs)

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [algod, pollMs])

  return supply
}
