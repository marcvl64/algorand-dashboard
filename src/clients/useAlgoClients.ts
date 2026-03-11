import { useContext } from 'react'
import { AlgoClientContext } from './AlgoClientProvider'

export function useAlgoClients() {
  const ctx = useContext(AlgoClientContext)
  if (!ctx) throw new Error('useAlgoClients must be used within AlgoClientProvider')
  return ctx
}
