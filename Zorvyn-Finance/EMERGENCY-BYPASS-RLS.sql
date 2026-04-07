-- ================================================
-- EMERGENCY BYPASS: Disable RLS Temporarily
-- This will prove if RLS is the issue
-- Run this in Supabase SQL Editor
-- ================================================

-- Step 1: DISABLE RLS on transactions table
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Step 2: Test query (should work instantly now)
SELECT COUNT(*) as count FROM transactions WHERE user_id = 'cfff579a-1587-4cb4-b982-deeff49ecd18';

-- Step 3: View transactions
SELECT * FROM transactions WHERE user_id = 'cfff579a-1587-4cb4-b982-deeff49ecd18' ORDER BY date DESC LIMIT 10;

-- ================================================
-- AFTER TESTING:
-- If app works with RLS disabled, we know RLS is the problem
-- Then re-enable with: ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- And apply the correct policies from FIX-RLS-TIMEOUT.sql
-- ================================================
