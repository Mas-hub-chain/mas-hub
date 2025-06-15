-- Phase 4: Advanced Features Database Schema

-- Notifications table for real-time notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook retry jobs table
CREATE TABLE IF NOT EXISTS webhook_retry_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_log_id UUID REFERENCES webhook_logs(id) ON DELETE CASCADE,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction logs table for blockchain transactions
CREATE TABLE IF NOT EXISTS transaction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  gas_used BIGINT,
  gas_price BIGINT,
  from_address TEXT,
  to_address TEXT,
  value_wei TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet logs table for wallet operations
CREATE TABLE IF NOT EXISTS wallet_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('hot', 'cold', 'hybrid')),
  operation TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add additional columns to existing tables (safe to run multiple times)
DO $$
BEGIN
  -- Add columns to webhook_logs if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhook_logs' AND column_name = 'signature_verified') THEN
    ALTER TABLE webhook_logs ADD COLUMN signature_verified BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhook_logs' AND column_name = 'user_agent') THEN
    ALTER TABLE webhook_logs ADD COLUMN user_agent TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhook_logs' AND column_name = 'processed_at') THEN
    ALTER TABLE webhook_logs ADD COLUMN processed_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webhook_logs' AND column_name = 'error_message') THEN
    ALTER TABLE webhook_logs ADD COLUMN error_message TEXT;
  END IF;

  -- Add columns to tokens if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tokens' AND column_name = 'confirmed_at') THEN
    ALTER TABLE tokens ADD COLUMN confirmed_at TIMESTAMPTZ;
  END IF;

  -- Add columns to kyc_logs if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_logs' AND column_name = 'verified_at') THEN
    ALTER TABLE kyc_logs ADD COLUMN verified_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create indexes for performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_webhook_retry_jobs_next_retry_at ON webhook_retry_jobs(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_webhook_retry_jobs_webhook_log_id ON webhook_retry_jobs(webhook_log_id);

CREATE INDEX IF NOT EXISTS idx_transaction_logs_hash ON transaction_logs(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_status ON transaction_logs(status);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_created_at ON transaction_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_wallet_logs_user_id ON wallet_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_logs_wallet_address ON wallet_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_logs_created_at ON wallet_logs(created_at);

-- Enhanced audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_resource ON audit_logs(action, resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc ON audit_logs(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_retry_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can manage webhook retry jobs" ON webhook_retry_jobs;
DROP POLICY IF EXISTS "Users can view related transaction logs" ON transaction_logs;
DROP POLICY IF EXISTS "Users can view their own wallet logs" ON wallet_logs;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for webhook retry jobs (admin only)
CREATE POLICY "Admin can manage webhook retry jobs" ON webhook_retry_jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS policies for transaction logs (users can view their own)
CREATE POLICY "Users can view related transaction logs" ON transaction_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tokens 
      WHERE tokens.tx_hash = transaction_logs.transaction_hash 
      AND tokens.tenant_id = auth.uid()
    )
  );

-- RLS policies for wallet logs
CREATE POLICY "Users can view their own wallet logs" ON wallet_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Function to clean up old notifications (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old audit logs (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Function to clean up processed webhook retry jobs
CREATE OR REPLACE FUNCTION cleanup_processed_webhook_retries()
RETURNS void AS $$
BEGIN
  DELETE FROM webhook_retry_jobs 
  WHERE webhook_log_id IN (
    SELECT id FROM webhook_logs WHERE processed = true
  );
END;
$$ LANGUAGE plpgsql;

-- Add role column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
  END IF;
END $$;

-- Create admin user function
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin' 
  WHERE id IN (
    SELECT id FROM auth.users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
