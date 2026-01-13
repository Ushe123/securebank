# Push to GitHub - Step by Step Guide

This guide will help you push the SecureBank app to a new GitHub repository.

## Prerequisites

- Git installed on your machine
- GitHub account
- A new GitHub repository created (empty, no README)

## Step 1: Create a New Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name your repository: `secure-bank`
3. Add description: "A modern, secure browser-based banking application"
4. Choose **Private** (recommended for banking apps)
5. DO NOT initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Configure Git Locally

Open your terminal/command prompt and navigate to your project directory:

```bash
# Navigate to your project
cd path/to/secure-bank

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SecureBank banking application"
```

## Step 3: Connect to GitHub Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/secure-bank.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Configure GitHub Secrets for Deployment

To enable automatic deployment to Vercel, add these secrets to your GitHub repo:

1. Go to: **Settings > Secrets and variables > Actions**
2. Click "New repository secret" and add:

   - **VERCEL_TOKEN**: Your Vercel API token
     - Get from: https://vercel.com/account/tokens
   
   - **VERCEL_ORG_ID**: Your Vercel organization ID
     - Get from: Vercel dashboard Settings
   
   - **VERCEL_PROJECT_ID**: Your SecureBank project ID
     - Get from: Vercel project Settings

3. Also add environment variables:

   - **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase URL
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase public key

## Step 5: Enable GitHub Actions

1. Go to: **Settings > Actions > General**
2. Enable actions workflow permissions
3. Allow read and write permissions for workflows

## Step 6: Deploy on Push

Now every push to `main` branch will trigger:
- Lint and type checking
- Build verification
- Automatic deployment to Vercel (production)

Pushes to other branches will only run lint checks and preview deployments.

## Troubleshooting

### Git remote already exists
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/secure-bank.git
```

### Authentication issues
Use GitHub CLI:
```bash
gh auth login
```

Or use SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/secure-bank.git
```

### Build failures
Check GitHub Actions logs in your repo's Actions tab to debug.

## File Structure in Repository

```
secure-bank/
├── .github/
│   └── workflows/          # CI/CD workflows
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities and Supabase clients
├── scripts/                # Database setup scripts
├── public/                 # Static assets
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md               # Project documentation
```

## Security Notes

- Never commit `.env` files (already in .gitignore)
- Keep Supabase keys in GitHub Secrets, not in code
- Use private repository for production
- Regularly rotate Vercel and GitHub tokens

## Next Steps

1. Push your code: `git push origin main`
2. Monitor deployment in GitHub Actions tab
3. Check your Vercel dashboard for live app
4. Share the live URL with users

For help, see [GitHub Docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories)
