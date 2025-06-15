-- Clean up existing policies and recreate them properly
-- This script is safe to run multiple times

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view and update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can insert their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can view their own tenant tokens" ON tokens;
DROP POLICY IF EXISTS "Users can insert their own tenant tokens" ON tokens;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create updated profile policy
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, company_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update tokens table constraints if needed
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tokens_tenant_id_fkey' 
    AND table_name = 'tokens'
  ) THEN
    ALTER TABLE tokens DROP CONSTRAINT tokens_tenant_id_fkey;
  END IF;
  
  -- Add the correct foreign key constraint
  ALTER TABLE tokens 
  ADD CONSTRAINT tokens_tenant_id_fkey 
  FOREIGN KEY (tenant_id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN
    -- Constraint already exists, do nothing
    NULL;
END $$;

-- Drop existing token policies
DROP POLICY IF EXISTS "Users can view their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can insert their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON tokens;
DROP POLICY IF EXISTS "Users can delete their own tokens" ON tokens;

-- Create comprehensive RLS policies for tokens
CREATE POLICY "Users can view their own tokens" ON tokens
  FOR SELECT USING (auth.uid() = tenant_id);

CREATE POLICY "Users can insert their own tokens" ON tokens
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Users can update their own tokens" ON tokens
  FOR UPDATE USING (auth.uid() = tenant_id);

CREATE POLICY "Users can delete their own tokens" ON tokens
  FOR DELETE USING (auth.uid() = tenant_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
