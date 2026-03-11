import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TpsDataPoint } from '../../types/dashboard'

interface TpsChartProps {
  data: TpsDataPoint[]
}

export function TpsChart({ data }: TpsChartProps) {
  const formatted = data.map((d) => ({
    time: new Date(d.time).toLocaleTimeString(),
    tps: Math.round(d.tps * 100) / 100,
  }))

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">TPS (100-block avg over time)</h3>
      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
          <span className="ml-2 opacity-60">Accumulating data...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="tps" stroke="oklch(var(--p))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
