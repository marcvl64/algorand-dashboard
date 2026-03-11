import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { TxTypeOverTime } from '../../hooks/useTxTypes'
import { TX_TYPE_COLORS, TX_TYPE_LABELS } from '../../types/dashboard'

interface TxTypeStackedChartProps {
  data: TxTypeOverTime[]
}

const TYPES = ['pay', 'axfer', 'appl', 'keyreg', 'acfg', 'afrz', 'stpf'] as const

export function TxTypeStackedChart({ data }: TxTypeStackedChartProps) {
  // Only show types that have at least 1 tx
  const activeTypes = TYPES.filter((type) => data.some((d) => d[type] > 0))

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">TX Volume by Type (per block)</h3>
      {data.length < 2 ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-md" />
          <span className="ml-2 opacity-60">Loading...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--bc) / 0.1)" />
            <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="oklch(var(--bc) / 0.4)" interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} stroke="oklch(var(--bc) / 0.4)" />
            <Tooltip contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {activeTypes.map((type) => (
              <Area
                key={type}
                type="monotone"
                dataKey={type}
                name={TX_TYPE_LABELS[type]}
                stackId="1"
                fill={TX_TYPE_COLORS[type]}
                stroke={TX_TYPE_COLORS[type]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
