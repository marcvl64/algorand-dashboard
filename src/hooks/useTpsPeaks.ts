import { useMemo } from 'react'
import type { TpsDataPoint } from '../types/dashboard'

export function useTpsPeak(history: TpsDataPoint[]): number {
  return useMemo(() => {
    if (history.length === 0) return 0
    return Math.max(...history.map((p) => p.tps))
  }, [history])
}
