-- Create profiles table for user account info
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create accounts table for bank accounts
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_number text NOT NULL UNIQUE,
  account_type text NOT NULL,
  balance decimal(15, 2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  to_account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  amount decimal(15, 2) NOT NULL,
  transaction_type text NOT NULL,
  description text,
  status text DEFAULT 'completed',
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_from_account ON transactions(from_account_id);
CREATE INDEX idx_transactions_to_account ON transactions(to_account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Allow users to view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow new user profile creation" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for accounts
CREATE POLICY "Allow users to view own accounts" ON accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Allow users to update own accounts" ON accounts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Allow users to insert own accounts" ON accounts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow users to delete own accounts" ON accounts FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Allow users to view their transactions" ON transactions FOR SELECT USING (
  from_account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  OR to_account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Allow users to insert their transactions" ON transactions FOR INSERT WITH CHECK (
  from_account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
);
