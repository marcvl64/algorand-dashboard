import { useState, useCallback } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export interface AccountInfo {
  address: string
  balance: number
  status: string
  totalAppsOptedIn: number
  totalAssetsOptedIn: number
  totalCreatedApps: number
  totalCreatedAssets: number
  minBalance: number
  incentiveEligible: boolean
  lastProposed: number
  lastHeartbeat: number
}

export function useAccountLookup() {
  const { indexer } = useAlgoClients()
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(
    async (address: string) => {
      setLoading(true)
      setError(null)
      setAccount(null)
      try {
        const result = await indexer.lookupAccountByID(address).do()
        const a = result.account
        setAccount({
          address: a.address,
          balance: Number(a.amount),
          status: a.status,
          totalAppsOptedIn: a.totalAppsOptedIn ?? 0,
          totalAssetsOptedIn: a.totalAssetsOptedIn ?? 0,
          totalCreatedApps: a.totalCreatedApps ?? 0,
          totalCreatedAssets: a.totalCreatedAssets ?? 0,
          minBalance: Number(a.minBalance ?? 0),
          incentiveEligible: a.incentiveEligible ?? false,
          lastProposed: Number(a.lastProposed ?? 0),
          lastHeartbeat: Number(a.lastHeartbeat ?? 0),
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to look up account')
      } finally {
        setLoading(false)
      }
    },
    [indexer],
  )

  return { account, loading, error, lookup }
}
