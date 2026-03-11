export interface BlockData {
  round: number
  timestamp: number
  txnCount: number
}

export interface TpsDataPoint {
  time: number
  tps: number
}
