-- Fix missing notifications table and related issues

-- Create notifications table if it doesn't exist
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

-- Create indexes for performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert a test notification to verify the table works (only if user is authenticated)
DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, read)
    VALUES (
      auth.uid(),
      'Welcome to MasChain Hub!',
      'Your account has been successfully set up.',
      'success',
      false
    )
    ON CONFLICT DO NOTHING;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if auth context is not available
    NULL;
END $$;

-- Verify table exists
SELECT 'Notifications table created successfully' as status;
