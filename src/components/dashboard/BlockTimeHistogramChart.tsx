import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { HistogramBin } from '../../hooks/useBlockTimeHistogram'

interface BlockTimeHistogramChartProps {
  data: HistogramBin[]
}

export function BlockTimeHistogramChart({ data }: BlockTimeHistogramChartProps) {
  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Block Time Distribution</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="count" name="Blocks" fill="oklch(var(--in))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
