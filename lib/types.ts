export interface Token {
  id: string
  tenant_id: string
  asset_type: string
  metadata: {
    name: string
    description: string
    quantity: number
    custom_metadata?: Record<string, any>
  }
  tx_hash: string
  status: "pending" | "confirmed" | "failed"
  created_at: string
}

export interface KYCLog {
  id: string
  wallet_address: string
  risk_score: number
  status: "low_risk" | "medium_risk" | "high_risk"
  verified: boolean
  created_at: string
}

export interface WebhookEvent {
  id: string
  event_type: string
  transaction_hash: string
  payload: Record<string, any>
  processed: boolean
  created_at: string
}

export interface MasChainConfig {
  network: "testnet" | "mainnet"
  apiUrl: string
  clientId: string
  clientSecret: string
}
