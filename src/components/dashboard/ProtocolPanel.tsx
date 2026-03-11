import type { ProtocolStatus } from '../../hooks/useProtocolStatus'

interface ProtocolPanelProps {
  status: ProtocolStatus | null
}

function shortVersion(version: string): string {
  // Extract the version part from the full protocol string
  // e.g. "https://github.com/algorandfoundation/specs/tree/..." -> last path segment
  const parts = version.split('/')
  const last = parts[parts.length - 1] || version
  return last.length > 30 ? `${last.slice(0, 30)}...` : last
}

export function ProtocolPanel({ status }: ProtocolPanelProps) {
  if (!status) {
    return (
      <div className="bg-base-200 rounded-box shadow p-4">
        <h3 className="text-sm font-semibold mb-2 opacity-60">Protocol</h3>
        <span className="loading loading-dots loading-sm" />
      </div>
    )
  }

  const upgradeInProgress = status.currentVersion !== status.nextVersion
  const upgradeVoteProgress =
    status.upgradeVoteRounds > 0 ? ((status.upgradeYesVotes / status.upgradeVoteRounds) * 100).toFixed(1) : null

  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Protocol</h3>
      <div className="space-y-2">
        <div>
          <span className="text-xs opacity-50">Current Version</span>
          <p className="font-mono text-sm font-semibold">{shortVersion(status.currentVersion)}</p>
        </div>

        {upgradeInProgress ? (
          <>
            <div className="divider my-1" />
            <div>
              <span className="text-xs opacity-50">Next Version</span>
              <p className="font-mono text-sm">{shortVersion(status.nextVersion)}</p>
            </div>
            <div>
              <span className="text-xs opacity-50">Upgrade Round</span>
              <p className="text-sm">{status.nextVersionRound.toLocaleString()}</p>
            </div>
            {upgradeVoteProgress && (
              <div>
                <span className="text-xs opacity-50">Vote Progress</span>
                <div className="flex items-center gap-2">
                  <progress className="progress progress-success w-full" value={status.upgradeYesVotes} max={status.upgradeVoteRounds} />
                  <span className="text-xs">{upgradeVoteProgress}%</span>
                </div>
                <p className="text-xs opacity-40 mt-1">
                  {status.upgradeYesVotes} yes / {status.upgradeNoVotes} no of {status.upgradeVoteRounds} rounds
                </p>
              </div>
            )}
            <div className="badge badge-sm badge-warning">Upgrade Pending</div>
          </>
        ) : (
          <div className="badge badge-sm badge-success">Up to date</div>
        )}
      </div>
    </div>
  )
}
