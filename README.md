# SecureBank - A Modern Banking Application

A full-stack banking application built with Next.js, React, Supabase, and Tailwind CSS. This is a browser-based application with no VNC requirements - everything runs directly in your web browser.

## Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Account Management**: Create and manage multiple bank accounts
- **Money Transfers**: Transfer funds between your accounts with real-time balance updates
- **Transaction History**: View detailed transaction records with timestamps and status
- **Responsive Design**: Mobile-first design that works on all devices
- **Row Level Security**: Data protection with Supabase RLS policies

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth)
- **Authentication**: Supabase Auth with email/password
- **Database**: PostgreSQL with Row Level Security (RLS)

## Quick Start

1. **Clone and install**:
   ```bash
   git clone https://github.com/yourusername/secure-bank.git
   cd secure-bank
   npm install
   ```

2. **Set up Supabase**:
   - Create a Supabase project at supabase.com
   - Copy your Project URL and Anon Key
   - Create `.env.local` and add your credentials

3. **Initialize database**:
   - Run the SQL schema from `scripts/init_banking_schema.sql` in Supabase

4. **Run the app**:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Features

- Sign up with email verification
- Dashboard with account overview
- Transfer money between accounts
- View transaction history
- Secure logout

## Deployment

Deploy to Vercel with one click - all environment variables are automatically configured.

See SETUP_GUIDE.md for detailed setup instructions.
