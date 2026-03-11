import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { TxTypeEntry } from '../../hooks/useTxTypes'
import { TX_TYPE_LABELS, TX_TYPE_COLORS, type TxType } from '../../types/dashboard'

interface TxTypeChartProps {
  data: TxTypeEntry[]
}

export function TxTypeChart({ data }: TxTypeChartProps) {
  const chartData = data.map((d) => ({
    name: TX_TYPE_LABELS[d.type],
    value: d.count,
    color: TX_TYPE_COLORS[d.type],
  }))

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">TX by Type (cached blocks)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
