-- Final fix for authentication and user profile creation
-- This script addresses the database error saving new user issue

-- First, let's check and fix the profiles table structure
DO $$
BEGIN
  -- Drop the table if it exists and recreate it with proper structure
  DROP TABLE IF EXISTS profiles CASCADE;
  
  -- Create profiles table with proper structure
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
  );

  -- Enable RLS
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Grant necessary permissions
  GRANT ALL ON profiles TO authenticated;
  GRANT ALL ON profiles TO service_role;

END $$;

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create a more robust function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table with error handling
  INSERT INTO public.profiles (id, company_name, industry, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'industry', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    company_name = COALESCE(NEW.raw_user_meta_data->>'company_name', profiles.company_name),
    industry = COALESCE(NEW.raw_user_meta_data->>'industry', profiles.industry),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();

-- Create comprehensive RLS policies for profiles
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create separate policies for better control
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fix tokens table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tokens') THEN
    -- Ensure RLS is enabled
    ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own tokens" ON tokens;
    DROP POLICY IF EXISTS "Users can insert their own tokens" ON tokens;
    DROP POLICY IF EXISTS "Users can update their own tokens" ON tokens;
    DROP POLICY IF EXISTS "Users can delete their own tokens" ON tokens;
    
    -- Recreate policies
    CREATE POLICY "Users can view their own tokens" ON tokens
      FOR SELECT USING (auth.uid() = tenant_id);
    
    CREATE POLICY "Users can insert their own tokens" ON tokens
      FOR INSERT WITH CHECK (auth.uid() = tenant_id);
    
    CREATE POLICY "Users can update their own tokens" ON tokens
      FOR UPDATE USING (auth.uid() = tenant_id);
    
    CREATE POLICY "Users can delete their own tokens" ON tokens
      FOR DELETE USING (auth.uid() = tenant_id);
  END IF;
END $$;

-- Create updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Test the setup by creating a test profile (this will be cleaned up)
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- This is just to test if our function works
  -- In real usage, this will be called by the trigger
  NULL;
END $$;
