import { useState, useCallback } from 'react'
import { useAlgoClients } from '../clients/useAlgoClients'

export interface AppInfo {
  id: number
  creator: string
  globalStateSchema: { numUints: number; numByteSlices: number }
  localStateSchema: { numUints: number; numByteSlices: number }
  extraPages: number
  globalStateCount: number
}

export function useAppLookup() {
  const { indexer } = useAlgoClients()
  const [app, setApp] = useState<AppInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(
    async (appId: number) => {
      setLoading(true)
      setError(null)
      setApp(null)
      try {
        const result = await indexer.lookupApplications(appId).do()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const a = result.application as any
        if (!a) throw new Error('Application not found')
        setApp({
          id: Number(a.id),
          creator: String(a.params?.creator ?? ''),
          globalStateSchema: {
            numUints: Number(a.params?.globalStateSchema?.numUint ?? 0),
            numByteSlices: Number(a.params?.globalStateSchema?.numByteSlice ?? 0),
          },
          localStateSchema: {
            numUints: Number(a.params?.localStateSchema?.numUint ?? 0),
            numByteSlices: Number(a.params?.localStateSchema?.numByteSlice ?? 0),
          },
          extraPages: Number(a.params?.extraProgramPages ?? 0),
          globalStateCount: a.params?.globalState?.length ?? 0,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to look up application')
      } finally {
        setLoading(false)
      }
    },
    [indexer],
  )

  return { app, loading, error, lookup }
}
