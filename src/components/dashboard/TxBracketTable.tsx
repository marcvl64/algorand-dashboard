import type { TxBracket } from '../../hooks/useTxBrackets'

interface TxBracketTableProps {
  data: TxBracket[]
}

export function TxBracketTable({ data }: TxBracketTableProps) {
  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-2 opacity-60">Transactions per Block</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>TX Volume</th>
                <th className="text-right">Blocks</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.range}>
                  <td>{row.range}</td>
                  <td className="text-right font-mono">{row.blocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
