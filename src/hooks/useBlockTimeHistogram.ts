import { useMemo } from 'react'
import type { BlockData } from '../types/dashboard'

export interface HistogramBin {
  label: string
  count: number
}

export function useBlockTimeHistogram(blocks: Map<number, BlockData>): HistogramBin[] {
  return useMemo(() => {
    const sorted = Array.from(blocks.values()).sort((a, b) => a.round - b.round)
    if (sorted.length < 2) return []

    const intervals: number[] = []
    for (let i = 1; i < sorted.length; i++) {
      const dt = sorted[i].timestamp - sorted[i - 1].timestamp
      if (dt >= 0 && dt <= 30) intervals.push(dt)
    }

    // Bins: 0-1s, 1-2s, 2-3s, 3-4s, 4-5s, 5-6s, 6-7s, 7-8s, 8-9s, 9-10s, 10s+
    const bins: HistogramBin[] = []
    for (let i = 0; i < 10; i++) {
      bins.push({ label: `${i}-${i + 1}s`, count: 0 })
    }
    bins.push({ label: '10s+', count: 0 })

    for (const dt of intervals) {
      const idx = Math.min(Math.floor(dt), 10)
      bins[idx].count++
    }

    return bins.filter((b) => b.count > 0)
  }, [blocks])
}
