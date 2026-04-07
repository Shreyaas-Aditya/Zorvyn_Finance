-- ================================================
-- QUICK FIX: Create sample transactions for testing
-- Run this in Supabase SQL Editor after logging in
-- ================================================

-- This will create 10 sample transactions for the current logged-in user
INSERT INTO transactions (user_id, amount, category, type, date, note) VALUES
  (auth.uid(), 5000.00, 'Salary', 'income', NOW() - INTERVAL '1 day', 'Monthly salary - January'),
  (auth.uid(), 1200.00, 'Rent', 'expense', NOW() - INTERVAL '2 days', 'Monthly rent payment'),
  (auth.uid(), 150.00, 'Groceries', 'expense', NOW() - INTERVAL '3 days', 'Weekly grocery shopping'),
  (auth.uid(), 50.00, 'Transport', 'expense', NOW() - INTERVAL '4 days', 'Gas and parking'),
  (auth.uid(), 2000.00, 'Freelance', 'income', NOW() - INTERVAL '5 days', 'Client project payment'),
  (auth.uid(), 300.00, 'Utilities', 'expense', NOW() - INTERVAL '6 days', 'Electricity and water bills'),
  (auth.uid(), 80.00, 'Entertainment', 'expense', NOW() - INTERVAL '7 days', 'Movies and dining'),
  (auth.uid(), 500.00, 'Investment', 'income', NOW() - INTERVAL '8 days', 'Dividend payment'),
  (auth.uid(), 120.00, 'Healthcare', 'expense', NOW() - INTERVAL '9 days', 'Doctor visit and medicine'),
  (auth.uid(), 200.00, 'Shopping', 'expense', NOW() - INTERVAL '10 days', 'Clothing and accessories');

-- Verify they were created
SELECT COUNT(*) as "Transactions Created" 
FROM transactions 
WHERE user_id = auth.uid();

-- View them
SELECT 
  amount,
  category,
  type,
  date::date as date,
  note
FROM transactions 
WHERE user_id = auth.uid()
ORDER BY date DESC;
