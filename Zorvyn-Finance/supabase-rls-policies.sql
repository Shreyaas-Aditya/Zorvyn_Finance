-- ============================================
-- Zorvyn Finance - Supabase RLS Policies
-- ============================================
-- Run this SQL in Supabase SQL Editor to set up Row Level Security

-- Enable RLS on transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TRANSACTIONS POLICIES
-- ============================================

-- 1. SELECT Policy: Users can view their own transactions
CREATE POLICY "Users can view own transactions" 
ON transactions 
FOR SELECT 
TO public 
USING (auth.uid() = user_id);

-- 2. INSERT Policy: Admins can create transactions
CREATE POLICY "Admins can create transactions" 
ON transactions 
FOR INSERT 
TO public 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 3. UPDATE Policy: Admins can update transactions
CREATE POLICY "Admins can update transactions" 
ON transactions 
FOR UPDATE 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 4. DELETE Policy: Admins can delete transactions
CREATE POLICY "Admins can delete transactions" 
ON transactions 
FOR DELETE 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- VERIFY POLICIES
-- ============================================
-- Run this to see all policies:
-- SELECT * FROM pg_policies WHERE tablename = 'transactions';
