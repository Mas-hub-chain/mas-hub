-- Add audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add missing columns to profiles table (safe to run multiple times)
DO $$
BEGIN
  -- Add network_preference column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'network_preference'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN network_preference TEXT DEFAULT 'testnet' CHECK (network_preference IN ('testnet', 'mainnet'));
  END IF;

  -- Add module_preferences column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'module_preferences'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN module_preferences JSONB DEFAULT '{"tokenization": true, "compliance": true, "wallet": false, "contracts": false, "analytics": false}';
  END IF;
END $$;

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON audit_logs;

-- Create policy for audit logs (users can only view their own logs)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for inserting audit logs
CREATE POLICY "Users can insert their own audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add performance indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at);
CREATE INDEX IF NOT EXISTS idx_kyc_logs_created_at ON kyc_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);

-- Add composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tokens_tenant_status ON tokens(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_kyc_logs_verified ON kyc_logs(verified, created_at);
