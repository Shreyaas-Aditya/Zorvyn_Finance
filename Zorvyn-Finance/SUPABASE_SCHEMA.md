# Supabase Database Schema

This document outlines the required database schema for the Zorvyn Finance Dashboard.

## Tables

### 1. profiles

Stores user profile information and roles.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
```

### 2. transactions

Stores financial transactions (income and expenses).

```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Only admins can insert transactions
CREATE POLICY "Admins can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Only admins can update transactions
CREATE POLICY "Admins can update transactions"
  ON transactions FOR UPDATE
  USING (
    auth.uid() = user_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Only admins can delete transactions
CREATE POLICY "Admins can delete transactions"
  ON transactions FOR DELETE
  USING (
    auth.uid() = user_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

## Database Trigger

Create a trigger to automatically create a profile when a new user signs up:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'viewer' -- Default role is viewer
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Setup Instructions

1. **Create the tables** in Supabase SQL Editor by running the SQL above in order
2. **Create the trigger** to auto-create profiles for new users
3. **Create an admin user manually** in Supabase Dashboard:
   - Go to Authentication > Users
   - Create a new user
   - Then run this SQL to make them an admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = '<user_id>';
   ```

## Sample Data (Optional)

```sql
-- Insert sample categories (or let users create them dynamically)
-- Categories are created automatically when transactions are added

-- Sample transactions (replace <user_id> with actual admin user ID)
INSERT INTO transactions (user_id, amount, category, type, date, note) VALUES
  ('<user_id>', 5000.00, 'Salary', 'income', '2024-01-01', 'Monthly salary'),
  ('<user_id>', 1200.00, 'Rent', 'expense', '2024-01-05', 'Monthly rent payment'),
  ('<user_id>', 150.00, 'Groceries', 'expense', '2024-01-10', 'Weekly groceries'),
  ('<user_id>', 50.00, 'Transport', 'expense', '2024-01-12', 'Gas'),
  ('<user_id>', 2000.00, 'Freelance', 'income', '2024-01-15', 'Project payment');
```

## Environment Variables

Make sure your `.env` file has:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Notes

- **Viewer role**: Can only view transactions (read-only)
- **Admin role**: Can create, update, and delete transactions
- All users can view their own profile but cannot change their role
- Signup always creates a `viewer` role by default
- Admin accounts must be created by manually updating the `role` in the `profiles` table
