import { useEffect, useRef, useState } from 'react'
import type { TpsDataPoint } from '../types/dashboard'

export function useTpsHistory(currentTps: number | null): TpsDataPoint[] {
  const [history, setHistory] = useState<TpsDataPoint[]>([])
  const lastTpsRef = useRef<number | null>(null)

  useEffect(() => {
    if (currentTps === null || currentTps === lastTpsRef.current) return
    lastTpsRef.current = currentTps

    setHistory((prev) => {
      const point: TpsDataPoint = { time: Date.now(), tps: currentTps }
      const next = [...prev, point]
      // Keep last 500 data points
      if (next.length > 500) return next.slice(-500)
      return next
    })
  }, [currentTps])

  return history
}
