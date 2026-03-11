import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ProposerEntry } from '../../hooks/useProposers'

interface ProposerChartProps {
  data: ProposerEntry[]
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#7c3aed', '#5b21b6', '#4f46e5', '#4338ca', '#3730a3']

function ellipse(addr: string) {
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}

export function ProposerChart({ data }: ProposerChartProps) {
  // Show top 8, group the rest as "Others"
  const top = data.slice(0, 8)
  const rest = data.slice(8)
  const othersCount = rest.reduce((sum, e) => sum + e.count, 0)

  const chartData = [
    ...top.map((e) => ({ name: ellipse(e.address), value: e.count, fullAddress: e.address })),
    ...(othersCount > 0 ? [{ name: 'Others', value: othersCount, fullAddress: '' }] : []),
  ]

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Block Proposers (last 100 blocks)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'oklch(var(--b2))', border: 'none', borderRadius: '8px' }}
              formatter={(value) => [`${value} blocks`, 'Proposed']}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
