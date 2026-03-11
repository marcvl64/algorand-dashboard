import { useState } from 'react'
import { useAppLookup } from '../../hooks/useAppLookup'

function ellipse(addr: string) {
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function AppLookup() {
  const [input, setInput] = useState('')
  const { app, loading, error, lookup } = useAppLookup()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = Number(input)
    if (id > 0) lookup(id)
  }

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Application Lookup</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="number"
          className="input input-bordered input-sm flex-1"
          placeholder="Enter Application ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          min={1}
        />
        <button type="submit" className="btn btn-sm btn-primary" disabled={Number(input) <= 0 || loading}>
          {loading ? <span className="loading loading-spinner loading-xs" /> : 'Lookup'}
        </button>
      </form>

      {error && <div className="alert alert-error text-sm mb-2">{error}</div>}

      {app && (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <td className="opacity-60">App ID</td>
                <td className="font-mono">{app.id}</td>
              </tr>
              <tr>
                <td className="opacity-60">Creator</td>
                <td className="font-mono text-xs">{ellipse(app.creator)}</td>
              </tr>
              <tr>
                <td className="opacity-60">Global Schema</td>
                <td>{app.globalStateSchema.numUints} uints, {app.globalStateSchema.numByteSlices} byte slices</td>
              </tr>
              <tr>
                <td className="opacity-60">Local Schema</td>
                <td>{app.localStateSchema.numUints} uints, {app.localStateSchema.numByteSlices} byte slices</td>
              </tr>
              <tr>
                <td className="opacity-60">Extra Pages</td>
                <td>{app.extraPages}</td>
              </tr>
              {app.globalStateCount > 0 && (
                <tr>
                  <td className="opacity-60">Global State Keys</td>
                  <td>{app.globalStateCount}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
