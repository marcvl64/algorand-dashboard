import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ProposersOverTimePoint } from '../../hooks/useProposersOverTime'

interface ProposersOverTimeChartProps {
  data: ProposersOverTimePoint[]
}

export function ProposersOverTimeChart({ data }: ProposersOverTimeChartProps) {
  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Unique Proposers (20-block window)</h3>
      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="oklch(var(--bc) / 0.4)" interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="uniqueProposers" name="Unique Proposers" fill="oklch(var(--su))" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
