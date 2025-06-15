-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  asset_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create KYC logs table
CREATE TABLE IF NOT EXISTS kyc_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL UNIQUE,
  risk_score NUMERIC(5,2),
  status TEXT CHECK (status IN ('low_risk', 'medium_risk', 'high_risk')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  transaction_hash TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_tokens_tenant_id ON tokens(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tokens_asset_type ON tokens(asset_type);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_kyc_logs_wallet_address ON kyc_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed ON webhook_logs(processed);

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own tenant tokens" ON tokens;
DROP POLICY IF EXISTS "Users can insert their own tenant tokens" ON tokens;
DROP POLICY IF EXISTS "Allow all operations on kyc_logs" ON kyc_logs;
DROP POLICY IF EXISTS "Allow all operations on webhook_logs" ON webhook_logs;

-- Create RLS policies (basic multi-tenant isolation)
CREATE POLICY "Users can view their own tenant tokens" ON tokens
  FOR SELECT USING (tenant_id = auth.uid()::uuid);

CREATE POLICY "Users can insert their own tenant tokens" ON tokens
  FOR INSERT WITH CHECK (tenant_id = auth.uid()::uuid);

-- For demo purposes, allow all operations on kyc_logs and webhook_logs
CREATE POLICY "Allow all operations on kyc_logs" ON kyc_logs
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on webhook_logs" ON webhook_logs
  FOR ALL USING (true);
