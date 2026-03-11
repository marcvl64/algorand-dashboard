import { useState } from 'react'
import { useAssetLookup } from '../../hooks/useAssetLookup'

function ellipse(addr: string) {
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function AssetLookup() {
  const [input, setInput] = useState('')
  const { asset, loading, error, lookup } = useAssetLookup()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = Number(input)
    if (id > 0) lookup(id)
  }

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Asset Lookup</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="number"
          className="input input-bordered input-sm flex-1"
          placeholder="Enter Asset ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          min={1}
        />
        <button type="submit" className="btn btn-sm btn-primary" disabled={Number(input) <= 0 || loading}>
          {loading ? <span className="loading loading-spinner loading-xs" /> : 'Lookup'}
        </button>
      </form>

      {error && <div className="alert alert-error text-sm mb-2">{error}</div>}

      {asset && (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="opacity-60">ID</td>
                <td className="font-mono">{asset.index}</td>
              </tr>
              <tr>
                <td className="opacity-60">Name</td>
                <td className="font-semibold">{asset.name || '—'}</td>
              </tr>
              <tr>
                <td className="opacity-60">Unit Name</td>
                <td>{asset.unitName || '—'}</td>
              </tr>
              <tr>
                <td className="opacity-60">Total Supply</td>
                <td className="font-mono">{BigInt(asset.total).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="opacity-60">Decimals</td>
                <td>{asset.decimals}</td>
              </tr>
              <tr>
                <td className="opacity-60">Creator</td>
                <td className="font-mono text-xs">{ellipse(asset.creator)}</td>
              </tr>
              {asset.url && (
                <tr>
                  <td className="opacity-60">URL</td>
                  <td className="text-xs break-all">{asset.url}</td>
                </tr>
              )}
              <tr>
                <td className="opacity-60">Default Frozen</td>
                <td>{asset.defaultFrozen ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className="opacity-60">Manager</td>
                <td className="font-mono text-xs">{asset.manager ? ellipse(asset.manager) : '—'}</td>
              </tr>
              <tr>
                <td className="opacity-60">Freeze</td>
                <td className="font-mono text-xs">{asset.freeze ? ellipse(asset.freeze) : '—'}</td>
              </tr>
              <tr>
                <td className="opacity-60">Clawback</td>
                <td className="font-mono text-xs">{asset.clawback ? ellipse(asset.clawback) : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
