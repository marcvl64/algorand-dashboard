import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { BlockData } from '../../types/dashboard'

interface TxCountChartProps {
  data: BlockData[]
}

export function TxCountChart({ data }: TxCountChartProps) {
  const formatted = data.map((d) => ({
    round: d.round,
    txns: d.txnCount,
  }))

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">TX Count (last 20 blocks)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="oklch(var(--bc) / 0.4)" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="txns" fill="oklch(var(--s))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
