import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { BlockTimePoint } from '../../hooks/useBlockTimes'

interface BlockTimeChartProps {
  data: BlockTimePoint[]
  avgBlockTime: number | null
}

export function BlockTimeChart({ data, avgBlockTime }: BlockTimeChartProps) {
  const formatted = data.map((d) => ({
    round: d.round,
    time: d.blockTime,
  }))

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Per-Block Round Time (seconds)</h3>
      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
          <span className="ml-2 opacity-60">Loading block data...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="oklch(var(--bc) / 0.4)" interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" domain={[0, 'auto']} />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            {avgBlockTime !== null && (
              <ReferenceLine y={avgBlockTime} stroke="oklch(var(--wa))" strokeDasharray="5 5" label={{ value: `avg ${avgBlockTime.toFixed(2)}s`, fill: 'oklch(var(--wa))', fontSize: 11 }} />
            )}
            <Line type="monotone" dataKey="time" stroke="oklch(var(--s))" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
