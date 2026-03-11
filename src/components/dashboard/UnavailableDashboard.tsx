const sections = [
  {
    category: 'Network Topology',
    source: 'Network + P2P dashboards',
    panels: [
      'Full-time node estimate (Chao-1)',
      'Node locations (geomap)',
      'Nodes by country (pie)',
      'Nodes by ASN/ISP (pie)',
      'Nodes by version (pie)',
      'P2P relay locations and edges',
      'Online/offline/firewalled node counts',
      'Average node uptime',
    ],
    reason: 'Requires a node crawler service that actively probes the Algorand P2P network. Not available via any public API.',
  },
  {
    category: 'Infrastructure & Storage',
    source: 'How Big Is Algorand dashboard',
    panels: [
      'Validator node storage size (mainnet/testnet/betanet)',
      'Archival node SQLite storage size',
      'Indexer PostgresDB storage size',
      'Monthly predicted SSD burn rate',
      'Monthly AWS RDS cost',
    ],
    reason: 'Requires direct filesystem access to Nodely infrastructure nodes. Internal operational metrics.',
  },
  {
    category: 'Voter Performance',
    source: 'Consensus dashboard',
    panels: [
      'Unique soft voters count',
      'Online stake voting %',
      'Stake needed to soft/cert vote',
      'Stake needed to propose (min proposer stake)',
      'Online stake proposing %',
      'Accounts with node issues (30-90% voting)',
      'Accounts critically low voting (0-30%)',
      'Top 20 voter performance heatmap',
      'Unique voters time series',
      'Voting performance per account table',
    ],
    reason:
      'Block certificates containing voter data are not exposed via the algod REST API. Requires direct node access or specialized telemetry aggregation.',
  },
  {
    category: 'Historical Trends (90+ days)',
    source: 'Consensus + Staking dashboards',
    panels: [
      'Total online stake 90-day trend',
      'Online account count over time',
      'Top 20 proposal performance heatmap (long-term)',
    ],
    reason: 'Requires long-term data storage (ClickHouse/PostgreSQL). Client-side cache is limited to ~300 recent blocks.',
  },
  {
    category: 'Staking Eligibility Details',
    source: 'Staking dashboard',
    panels: [
      'Eligible accounts by type (pie)',
      'Eligible stake by type (pie)',
      'Eligible accounts by status (suspended/eligible/below min/above max)',
      'Eligible accounts by rekey status',
      'Suspended stake total',
      'Staking providers distribution',
      'Reward eligible account count',
    ],
    reason:
      'Requires PostgreSQL views joining account data with incentive eligibility rules, suspension tracking, and staking provider metadata. The Indexer API does not support filtering by these criteria efficiently.',
  },
  {
    category: 'Account Analytics',
    source: 'Accounts dashboard',
    panels: [
      'Algo holdings distribution (18 balance brackets)',
      'Top 20 Algo addresses',
      'In/Out flow Sankey diagram',
      'Top online accounts by stake with performance',
    ],
    reason:
      'Balance distribution requires scanning all ~30M+ accounts. Sankey diagrams need deep transaction history. Performance metrics need voter data.',
  },
  {
    category: 'Asset Analytics',
    source: 'Standard Algorand Assets dashboard',
    panels: [
      'ASA market cap in Algo (top 25)',
      'Top token holders by Algo value',
      'ASA on-chain volume word cloud',
      'ASA by TX count word cloud',
      'ASA volume time series',
    ],
    reason: 'Requires price feed integration (Vestige/Tinyman), historical transaction aggregation, and account-asset balance scanning.',
  },
  {
    category: 'App Analytics',
    source: 'Apps dashboard',
    panels: ['Top decentralized apps by unique callers (7-day)'],
    reason:
      'Requires aggregating all app-call transactions over 7 days with unique sender counts. Partially available from cached blocks (see Apps tab), but limited to ~300 blocks vs. 7 days (~180K blocks).',
  },
  {
    category: 'Upgrade & Telemetry',
    source: 'Upgrade Stats dashboard',
    panels: ['Node version distribution (current)', 'Node version adoption timeline'],
    reason: 'Requires node telemetry collection service that aggregates version reports from participating nodes.',
  },
  {
    category: 'xGov',
    source: 'XGov Members dashboard',
    panels: ['XGov registry info', 'Active proposal voting status'],
    reason:
      'Technically possible via algod box storage API, but requires knowing specific xGov app IDs and implementing ABI decoding for box data.',
  },
]

export function UnavailableDashboard() {
  return (
    <div className="space-y-4">
      <div className="bg-base-200 rounded-box shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Unavailable Panels</h3>
        <p className="text-sm opacity-60">
          The following Nodely/Grafana dashboard panels cannot be reproduced using public Algorand Algod and Indexer REST APIs. They
          require specialized infrastructure such as node crawlers, telemetry services, or large-scale historical databases.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.category} className="bg-base-200 rounded-box shadow p-4">
          <h4 className="font-semibold mb-1">{section.category}</h4>
          <p className="text-xs opacity-40 mb-3">Source: {section.source}</p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            {section.panels.map((panel) => (
              <li key={panel} className="opacity-70">
                {panel}
              </li>
            ))}
          </ul>
          <div className="alert alert-warning text-xs py-2">
            <span>{section.reason}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
