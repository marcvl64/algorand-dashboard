import type { TopAppEntry } from '../../hooks/useTopApps'

interface TopAppsTableProps {
  data: TopAppEntry[]
}

export function TopAppsTable({ data }: TopAppsTableProps) {
  const totalCalls = data.reduce((s, e) => s + e.calls, 0)

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Top Apps by Calls (cached blocks)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>App ID</th>
                <th className="text-right">Calls</th>
                <th className="text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => (
                <tr key={entry.appId}>
                  <td>{i + 1}</td>
                  <td className="font-mono">{entry.appId}</td>
                  <td className="text-right font-mono">{entry.calls}</td>
                  <td className="text-right font-mono">{((entry.calls / totalCalls) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
