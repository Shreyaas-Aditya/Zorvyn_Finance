-- ================================================
-- CRITICAL FIX: RLS Policies Causing Query Timeout
-- Run this IMMEDIATELY in Supabase SQL Editor
-- ================================================

-- Step 1: Drop ALL existing problematic policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can create transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Step 2: Make sure RLS is enabled
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TRANSACTIONS POLICIES (FIXED)
-- ============================================

-- SELECT: Any authenticated user can view their own transactions
CREATE POLICY "select_own_transactions"
ON transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- INSERT: Admins can insert transactions (simplified, no recursive check)
CREATE POLICY "insert_admin_transactions"
ON transactions
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- UPDATE: Admins can update their own transactions
CREATE POLICY "update_admin_transactions"
ON transactions
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
)
WITH CHECK (
  user_id = auth.uid()
);

-- DELETE: Admins can delete their own transactions
CREATE POLICY "delete_admin_transactions"
ON transactions
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
  AND (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) = 'admin'
);

-- ============================================
-- PROFILES POLICIES (FIXED)
-- ============================================

-- SELECT: Users can view their own profile
CREATE POLICY "select_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- UPDATE: Users can update their own profile
CREATE POLICY "update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Check transactions policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'transactions'
ORDER BY policyname;

-- Check profiles policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- TEST THE FIX
-- ============================================

-- This should now return your transactions instantly
SELECT COUNT(*) as transaction_count
FROM transactions
WHERE user_id = auth.uid();

-- ================================================
-- KEY CHANGES MADE:
-- ================================================
-- ✅ Changed "TO public" → "TO authenticated"
--    (public causes issues with auth.uid())
-- ✅ Removed EXISTS() subqueries that could cause recursion
-- ✅ Used direct SELECT for role check (faster, no recursion)
-- ✅ Renamed policies to avoid conflicts
-- ✅ Simplified policy logic
-- ================================================
