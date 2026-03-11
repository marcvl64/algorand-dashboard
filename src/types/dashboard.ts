export type TxType = 'pay' | 'axfer' | 'appl' | 'keyreg' | 'acfg' | 'afrz' | 'stpf' | 'unknown'

export const TX_TYPE_LABELS: Record<TxType, string> = {
  pay: 'Payment',
  axfer: 'Asset Transfer',
  appl: 'App Call',
  keyreg: 'Key Registration',
  acfg: 'Asset Config',
  afrz: 'Asset Freeze',
  stpf: 'State Proof',
  unknown: 'Unknown',
}

export const TX_TYPE_COLORS: Record<TxType, string> = {
  pay: '#6366f1',
  axfer: '#8b5cf6',
  appl: '#ec4899',
  keyreg: '#f59e0b',
  acfg: '#10b981',
  afrz: '#06b6d4',
  stpf: '#64748b',
  unknown: '#9ca3af',
}

export interface BlockData {
  round: number
  timestamp: number
  txnCount: number
  proposer: string
  txnTypes: Partial<Record<TxType, number>>
}

export interface TpsDataPoint {
  time: number
  tps: number
}
