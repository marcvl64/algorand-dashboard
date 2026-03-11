interface StatPanelProps {
  title: string
  value: string | number | null
  subtitle?: string
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
}

export function StatPanel({ title, value, subtitle, color = 'primary' }: StatPanelProps) {
  return (
    <div className="stat bg-base-200 rounded-box shadow">
      <div className="stat-title">{title}</div>
      <div className={`stat-value text-${color}`}>{value !== null ? value : <span className="loading loading-dots loading-sm" />}</div>
      {subtitle && <div className="stat-desc">{subtitle}</div>}
    </div>
  )
}
