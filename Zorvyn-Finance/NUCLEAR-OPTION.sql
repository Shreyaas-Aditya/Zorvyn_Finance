-- ================================================
-- ULTIMATE FIX: Drop ALL policies and recreate clean
-- ================================================

-- Nuclear option: Drop everything and start fresh
BEGIN;

-- Drop ALL policies on transactions
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'transactions') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON transactions';
    END LOOP;
END $$;

-- Drop ALL policies on profiles
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- Disable RLS temporarily
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

COMMIT;

-- ================================================
-- Now test if transactions load
-- Refresh your app - transactions should load!
-- ================================================

-- If it works, continue with step 2 below
-- If it STILL doesn't work, the issue is NOT RLS

-- ================================================
-- STEP 2: Re-enable RLS with SIMPLE policies
-- Only run this AFTER confirming app works without RLS
-- ================================================

BEGIN;

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Super simple SELECT policy - no complex checks
CREATE POLICY "allow_authenticated_select"
ON transactions
FOR SELECT
TO authenticated
USING (true);  -- Allow all authenticated users to see all transactions for testing

-- Simple profile policy
CREATE POLICY "allow_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

COMMIT;

-- ================================================
-- Test again - should still work
-- If it breaks again, we know the specific policy is the issue
-- ================================================
