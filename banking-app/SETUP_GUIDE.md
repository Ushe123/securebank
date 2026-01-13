# SecureBank Setup Guide

A step-by-step guide to get SecureBank running on your system.

## 1. Prerequisites Check

Make sure you have:
- Node.js 18+ (check with `node --version`)
- npm or yarn (check with `npm --version`)
- A Supabase account (free at supabase.com)
- Git installed

## 2. Supabase Project Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Enter project name: `banking-app`
5. Create a secure password (save it!)
6. Select your region
7. Click "Create new project" and wait for setup

### Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 3. Local Setup

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/banking-app.git
cd banking-app

# Install dependencies
npm install
```

### Configure Environment

1. Create `.env.local` in the project root
2. Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...xxxxx
   ```

### Initialize Database

1. Go to your Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New query**
4. Copy and paste the entire content from `scripts/init_banking_schema.sql`
5. Click **Run**
6. Wait for completion (you should see "Success" message)

## 4. Run the Application

```bash
# Development mode
npm run dev

# Open browser to http://localhost:3000
```

## 5. Test the App

### Create an Account

1. Click "Sign Up"
2. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Test123!@`
3. Click "Sign Up"
4. Check your email for verification link
5. Click the link to verify
6. Go back and login with your credentials

### Explore Features

**Dashboard:**
- View your total balance
- See your checking account
- Click "Transfer" from account card

**Transfer:**
- Need 2+ accounts to transfer
- Create another account in Supabase if needed
- Try a test transfer of $100

**History:**
- View all your transactions
- See transfer details

## 6. Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Environment Variables Not Working

1. Make sure file is `.env.local` (not `.env`)
2. Restart the dev server after changes
3. Check values are copied correctly (no extra spaces)

### Database Connection Failed

1. Verify credentials in Supabase dashboard
2. Check `.env.local` has exact URLs
3. Run SQL schema again in Supabase editor
4. Check Supabase project status is "healthy"

### Email Not Received

1. Check spam/junk folder
2. Wait a few minutes (sometimes delayed)
3. Check email in Supabase Auth section
4. Manually enable the user:
   - Supabase Dashboard → Authentication → Users
   - Find your user → Edit → Email Confirmed (toggle on)
   - Click Save

### Can't Transfer Money

1. Need at least 2 accounts
2. In Supabase, go to `accounts` table
3. Insert a new account for your user:
   ```
   id: (auto-generate)
   user_id: (your user id)
   account_number: SAV123456789
   account_type: Savings
   balance: 500
   currency: USD
   ```

## 7. Deploy to Vercel

### Connect GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Continue"

### Add Environment Variables

1. In Vercel, go to **Settings** → **Environment Variables**
2. Add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`, Value: `https://xxxxx.supabase.co`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Value: `eyJxx...`
3. Click **Save**

### Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Your app is now live!
4. Click the deployment URL to access

## 8. Next Steps

- Customize colors in `app/globals.css`
- Add more account types in the database
- Implement additional features
- Set up CI/CD with GitHub Actions
- Monitor with Vercel Analytics

## Common Questions

**Q: Can I use this for real banking?**
A: No, this is a demo app. For real banking, you'd need real bank integrations and regulatory compliance.

**Q: How do I add more users?**
A: Each user can sign up through the app. They'll get their own accounts and transactions.

**Q: Can I delete my data?**
A: Yes, but you'll need to do it through Supabase dashboard or add delete functionality to the app.

**Q: Is this secure?**
A: It uses industry-standard security (Supabase Auth, RLS, HTTPS). For production, add additional security measures.

---

Need help? Check the main README.md or open an issue on GitHub!
