import { createContext, useMemo, type ReactNode } from 'react'
import algosdk from 'algosdk'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

export interface AlgoClients {
  algod: algosdk.Algodv2
}

export const AlgoClientContext = createContext<AlgoClients | null>(null)

export function AlgoClientProvider({ children }: { children: ReactNode }) {
  const clients = useMemo(() => {
    const config = getAlgodConfigFromViteEnvironment()
    const algod = new algosdk.Algodv2(String(config.token ?? ''), config.server, config.port)
    return { algod }
  }, [])

  return <AlgoClientContext.Provider value={clients}>{children}</AlgoClientContext.Provider>
}
