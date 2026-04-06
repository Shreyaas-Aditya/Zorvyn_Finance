-- ================================================
-- FIX RLS POLICIES FOR TRANSACTIONS TABLE
-- Run this in Supabase SQL Editor
-- ================================================

-- Step 1: Drop ALL existing policies on transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON transactions;

-- Step 2: Make sure RLS is enabled
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SELECT policy - users can see their own transactions
-- This allows any authenticated user to see rows where user_id = their auth.uid()
CREATE POLICY "Users can view own transactions"
ON transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Step 4: Create INSERT policy - admins can insert transactions
-- Admins can insert, and must set user_id to their own id
CREATE POLICY "Admins can insert transactions"
ON transactions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  AND user_id = auth.uid()
);

-- Step 5: Create UPDATE policy - admins can update their own transactions
CREATE POLICY "Admins can update transactions"
ON transactions
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  user_id = auth.uid()
);

-- Step 6: Create DELETE policy - admins can delete their own transactions
CREATE POLICY "Admins can delete transactions"
ON transactions
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Step 7: Also ensure profiles table has RLS policies
-- Drop existing if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ================================================
-- DONE! Now test by logging in and viewing transactions
-- ================================================
