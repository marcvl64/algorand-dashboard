import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { UniqueValuesPoint } from '../../hooks/useUniqueValues'

interface UniqueValuesChartProps {
  data: UniqueValuesPoint[]
}

export function UniqueValuesChart({ data }: UniqueValuesChartProps) {
  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Unique Values per Block</h3>
      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
          <span className="ml-2 opacity-60">Loading...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="oklch(var(--bc) / 0.4)" interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="senders" name="Senders" stroke="#6366f1" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="receivers" name="Receivers" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="apps" name="Apps" stroke="#ec4899" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="assets" name="Assets" stroke="#10b981" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
