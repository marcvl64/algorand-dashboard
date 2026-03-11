import { useEffect, useRef, useState } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export interface ProtocolStatus {
  currentVersion: string
  nextVersion: string
  nextVersionRound: number
  nextVersionSupported: boolean
  upgradeDelay: number
  upgradeVotesRequired: number
  upgradeYesVotes: number
  upgradeNoVotes: number
  upgradeVoteRounds: number
}

export function useProtocolStatus(pollMs = 10000) {
  const { algod } = useAlgoClients()
  const [status, setStatus] = useState<ProtocolStatus | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      try {
        const s = await algod.status().do()
        if (!cancelled) {
          setStatus({
            currentVersion: String(s.lastVersion ?? ''),
            nextVersion: String(s.nextVersion ?? ''),
            nextVersionRound: Number(s.nextVersionRound ?? 0),
            nextVersionSupported: Boolean(s.nextVersionSupported),
            upgradeDelay: Number(s.upgradeDelay ?? 0),
            upgradeVotesRequired: Number(s.upgradeVotesRequired ?? 0),
            upgradeYesVotes: Number(s.upgradeYesVotes ?? 0),
            upgradeNoVotes: Number(s.upgradeNoVotes ?? 0),
            upgradeVoteRounds: Number(s.upgradeVoteRounds ?? 0),
          })
        }
      } catch (e) {
        console.error('Failed to poll protocol status:', e)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, pollMs)

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [algod, pollMs])

  return status
}
