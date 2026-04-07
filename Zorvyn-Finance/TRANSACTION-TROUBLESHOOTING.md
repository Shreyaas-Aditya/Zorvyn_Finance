# Transaction Fetching - Troubleshooting Guide

## Common Issues Fixed

### 1. Race Condition in TransactionsContext ✅
**Problem**: Multiple dependencies in useEffect causing repeated fetches
**Solution**: 
- Implemented `useCallback` for memoized fetch function
- Changed dependencies to `[user?.id, session?.access_token, authLoading, fetchTransactions]`
- This prevents unnecessary re-renders and duplicate API calls

### 2. Improved Error Handling ✅
**Problem**: Errors were being swallowed without proper logging
**Solution**:
- Added comprehensive error logging in `db.js`
- Added specific error codes handling (PGRST301 for permission issues)
- Improved error messages to help diagnose issues

### 3. Better Loading State Management ✅
**Problem**: Loading states weren't properly coordinated between Auth and Transactions
**Solution**:
- AuthContext now properly waits for session AND profile
- TransactionsContext waits for `authLoading` to complete
- Safety timeout in AuthContext (5 seconds) to prevent infinite loading

## Debugging Steps

### If transactions don't load:

1. **Check Browser Console**
   ```
   Look for:
   - "TransactionsContext: Successfully loaded X transactions"
   - Any error messages from db.listTransactions
   ```

2. **Verify User is Authenticated**
   ```javascript
   // In browser console:
   const { data } = await supabase.auth.getSession()
   console.log(data.session) // Should show user session
   ```

3. **Check RLS Policies in Supabase**
   - Go to Supabase Dashboard → Table Editor → transactions
   - Click "RLS" icon
   - Ensure "Users can view own transactions" policy exists
   - Run the fix-rls-policies.sql if needed

4. **Verify Transactions Exist**
   ```sql
   -- Run in Supabase SQL Editor
   SELECT * FROM transactions WHERE user_id = 'your-user-id';
   ```

5. **Check User Role**
   ```sql
   -- Run in Supabase SQL Editor
   SELECT id, name, role FROM profiles WHERE id = 'your-user-id';
   ```

## Create Sample Transactions

If you don't have any transactions, run this in Supabase SQL Editor:

```sql
-- Replace 'your-user-id' with your actual user ID
-- Find your user ID: SELECT id FROM auth.users WHERE email = 'your@email.com';

INSERT INTO transactions (user_id, amount, category, type, date, note) VALUES
  ('your-user-id', 5000.00, 'Salary', 'income', NOW(), 'Monthly salary'),
  ('your-user-id', 1200.00, 'Rent', 'expense', NOW() - INTERVAL '1 day', 'Monthly rent'),
  ('your-user-id', 150.00, 'Groceries', 'expense', NOW() - INTERVAL '2 days', 'Weekly groceries'),
  ('your-user-id', 2000.00, 'Freelance', 'income', NOW() - INTERVAL '3 days', 'Project payment');
```

## RLS Policy Verification

Run this query to check if RLS policies are working:

```sql
-- This should return transactions for the current user
SELECT * FROM transactions;

-- This should show your current user ID
SELECT auth.uid();

-- This should return true if you're an admin
SELECT role FROM profiles WHERE id = auth.uid();
```

## Common Error Messages

### "PGRST301: JWT expired"
**Solution**: Session expired, need to re-login
```javascript
// Force logout and re-login
await supabase.auth.signOut()
// Then navigate to /login
```

### "No rows returned"
**Cause**: No transactions exist for this user
**Solution**: Create some sample transactions (see SQL above)

### "FORBIDDEN: Only admins can..."
**Cause**: User role is 'viewer', not 'admin'
**Solution**: Update user role in Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

### "Unable to fetch transactions. Please check your permissions."
**Cause**: RLS policy blocking access
**Solution**: Run fix-rls-policies.sql to recreate policies

## Performance Optimizations Applied

1. **Memoized Fetch Function**: Prevents function recreation on every render
2. **Single Effect**: One useEffect in TransactionsContext instead of multiple
3. **Dependency Array**: Only includes essential dependencies
4. **Better Logging**: Console logs help track fetch lifecycle

## Testing Checklist

- [ ] Login successfully
- [ ] Transactions load on dashboard
- [ ] Can add new transaction (admin only)
- [ ] Can edit transaction (admin only)
- [ ] Can delete transaction (admin only)
- [ ] Transactions persist after refresh
- [ ] Transactions persist after minimize/maximize
- [ ] Transactions persist after logout/login
- [ ] Filter and search work correctly
- [ ] Charts update with transaction data

## Network Tab Inspection

Open DevTools → Network tab and look for:

1. **`getSession` request**: Should return 200 with valid session
2. **`transactions` POST request**: Should return 200 with array of transactions
3. **Response body**: Should contain transaction data

If you see 401/403 errors, it's an authentication/permission issue.

## Still Having Issues?

1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Check Supabase project status (is it running?)
4. Verify .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
5. Check Supabase logs for errors (Dashboard → Logs)
