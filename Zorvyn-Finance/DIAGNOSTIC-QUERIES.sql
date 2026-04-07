-- ================================================
-- DIAGNOSTIC: Check if transactions exist and RLS is working
-- Run these queries one by one in Supabase SQL Editor
-- ================================================

-- 1. Check your current user ID
SELECT 
  auth.uid() as "Your User ID",
  (SELECT email FROM auth.users WHERE id = auth.uid()) as "Your Email";

-- 2. Check if you have a profile and your role
SELECT 
  id as user_id,
  name,
  role,
  created_at
FROM profiles 
WHERE id = auth.uid();

-- 3. Count total transactions in the database (all users)
SELECT 
  COUNT(*) as total_transactions,
  COUNT(DISTINCT user_id) as unique_users
FROM transactions;

-- 4. Count YOUR transactions specifically
SELECT 
  COUNT(*) as my_transaction_count
FROM transactions 
WHERE user_id = auth.uid();

-- 5. View YOUR transactions (if any exist)
SELECT 
  id,
  amount,
  category,
  type,
  date,
  note,
  created_at
FROM transactions 
WHERE user_id = auth.uid()
ORDER BY date DESC
LIMIT 10;

-- 6. Check if RLS is enabled on transactions table
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'transactions';

-- 7. List all RLS policies on transactions table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression
FROM pg_policies 
WHERE tablename = 'transactions';

-- 8. Test if you can manually insert a transaction
-- (Only works if you're an admin)
-- Change the values as needed
INSERT INTO transactions (user_id, amount, category, type, date, note)
VALUES (
  auth.uid(),  -- Your user ID
  100.00,      -- Amount
  'Test',      -- Category
  'expense',   -- Type: 'income' or 'expense'
  NOW(),       -- Date
  'Test transaction from SQL'  -- Note
)
RETURNING id, amount, category, type, date;

-- 9. If step 8 worked, verify it shows up
SELECT 
  COUNT(*) as count_after_insert
FROM transactions 
WHERE user_id = auth.uid();

-- 10. Delete the test transaction (optional)
-- DELETE FROM transactions 
-- WHERE user_id = auth.uid() 
-- AND note = 'Test transaction from SQL';

-- ================================================
-- TROUBLESHOOTING TIPS
-- ================================================
-- If step 4 returns 0: You have no transactions. Create some!
-- If step 6 shows RLS Enabled = false: Run fix-rls-policies.sql
-- If step 7 shows no policies: Run fix-rls-policies.sql
-- If step 8 fails with "permission denied": Your role is 'viewer', not 'admin'
--   Fix: UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
-- ================================================
