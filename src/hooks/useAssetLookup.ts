import { useState, useCallback } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export interface AssetInfo {
  index: number
  name: string
  unitName: string
  total: string
  decimals: number
  creator: string
  url: string
  manager: string
  reserve: string
  freeze: string
  clawback: string
  defaultFrozen: boolean
}

export function useAssetLookup() {
  const { indexer } = useAlgoClients()
  const [asset, setAsset] = useState<AssetInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(
    async (assetId: number) => {
      setLoading(true)
      setError(null)
      setAsset(null)
      try {
        const result = await indexer.lookupAssetByID(assetId).do()
        const a = result.asset
        const p = a.params
        setAsset({
          index: Number(a.index),
          name: p.name ?? '',
          unitName: p.unitName ?? '',
          total: String(p.total),
          decimals: p.decimals,
          creator: String(p.creator ?? ''),
          url: p.url ?? '',
          manager: String(p.manager ?? ''),
          reserve: String(p.reserve ?? ''),
          freeze: String(p.freeze ?? ''),
          clawback: String(p.clawback ?? ''),
          defaultFrozen: p.defaultFrozen ?? false,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to look up asset')
      } finally {
        setLoading(false)
      }
    },
    [indexer],
  )

  return { asset, loading, error, lookup }
}
