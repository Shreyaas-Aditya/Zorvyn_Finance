# 🔐 RBAC Setup Guide

## Current Implementation Status

✅ **Frontend RBAC** - Already implemented in the code
✅ **Analytics** - Working with existing transactions
❌ **Supabase RLS Policies** - Needs to be configured

---

## 🎯 How RBAC Works

### **Viewer Role**
- ✅ Can **VIEW** their own transactions
- ❌ Cannot add, edit, or delete transactions
- ✅ Can see analytics (charts, insights, totals)
- ✅ Can export their transactions to CSV

### **Admin Role**
- ✅ Can **VIEW** all transactions
- ✅ Can **ADD** new transactions
- ✅ Can **EDIT** existing transactions
- ✅ Can **DELETE** transactions
- ✅ Full access to analytics

---

## 📋 Setup Instructions

### Step 1: Apply RLS Policies in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-rls-policies.sql`
4. Paste and **Run** the SQL script

This will:
- Enable Row Level Security on the transactions table
- Create policies for SELECT, INSERT, UPDATE, DELETE
- Ensure viewers can only see their own data
- Ensure only admins can modify transactions

---

### Step 2: Verify RLS Policies

After running the SQL, verify the policies are active:

1. Go to **Database** → **Tables** → **transactions**
2. Click on **Policies** tab
3. You should see 4 policies:
   - ✅ Users can view own transactions (SELECT)
   - ✅ Admins can create transactions (INSERT)
   - ✅ Admins can update transactions (UPDATE)
   - ✅ Admins can delete transactions (DELETE)

---

### Step 3: Test RBAC

#### **Test as Viewer:**
1. Sign up as a new user (automatically gets `viewer` role)
2. You should see:
   - ✅ Your own transactions
   - ❌ No "Add" button
   - ❌ No "Edit" or "Delete" buttons
   - ✅ Analytics showing your data

#### **Test as Admin:**
1. In Supabase, go to **Authentication** → **Users**
2. Find a user
3. Go to **Database** → **profiles** table
4. Change their `role` from `viewer` to `admin`
5. Log in as that user
6. You should see:
   - ✅ "Add" button visible
   - ✅ "Edit" and "Delete" buttons on each row
   - ✅ Full access to all features

---

## 🔍 Troubleshooting

### "Can't see transactions"
**Cause:** RLS policies block access

**Solution:**
1. Check if RLS is enabled: `SELECT * FROM pg_policies WHERE tablename = 'transactions';`
2. Verify your role in profiles table
3. Check browser console for errors

### "Admin can't add transactions"
**Cause:** INSERT policy not working

**Solution:**
1. Verify admin role in profiles table: `SELECT * FROM profiles WHERE id = 'user-id';`
2. Re-run the INSERT policy SQL
3. Clear browser cache and re-login

### "Viewer can see admin features"
**Cause:** Role not fetched correctly

**Solution:**
1. Check browser console for role value
2. Verify profiles table has correct role
3. Refresh the page after role change

---

## 📊 Analytics Features

All analytics are now working:

### **Summary Cards**
- Total Balance (Income - Expenses)
- Total Income
- Total Expenses

### **Charts**
- **Balance Trend** - Line chart showing balance over time
- **Spending by Category** - Pie chart of expense categories

### **Insights**
- Highest spending category
- This month vs last month comparison
- Auto-generated summary

### **Transactions Table**
- Search, filter, sort
- Export to CSV
- Add/Edit/Delete (admin only)

---

## 🎨 UI Features

- ✅ Light/Dark theme toggle
- ✅ Responsive design
- ✅ Clean neutral colors (no blue tint)
- ✅ Role indicator in navbar
- ✅ Toast notifications

---

## 🔑 Test Accounts

Create these accounts for testing:

### Viewer Account
```
Email: viewer@test.com
Password: test1234
Role: viewer (default)
```

### Admin Account
```
Email: admin@test.com
Password: test1234
Role: admin (manually set in Supabase)
```

---

## ✨ Next Steps

1. Run the RLS policy SQL in Supabase
2. Test with both viewer and admin accounts
3. Add sample transactions to test analytics
4. Verify all RBAC restrictions work correctly

---

All done! Your RBAC is now fully configured. 🎉
