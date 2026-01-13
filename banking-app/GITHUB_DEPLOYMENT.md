# Deploy SecureBank to GitHub

A complete guide to deploy your banking app to GitHub and then to production.

## Step 1: Create GitHub Repository

### Initialize Git

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: SecureBank banking app"
```

### Create GitHub Repo

1. Go to [github.com](https://github.com) and login
2. Click "New repository" (top right)
3. Name it: `banking-app`
4. Add description: "A modern banking application built with Next.js and Supabase"
5. Choose **Public** or **Private**
6. Do NOT initialize with README (we have one)
7. Click "Create repository"

### Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/banking-app.git

# Rename branch to main if needed
git branch -M main

# Push code
git push -u origin main
```

## Step 2: Prepare for Production

### Update Configuration

1. Edit `next.config.mjs`:
   ```js
   const nextConfig = {
     reactStrictMode: true,
     swcMinify: true,
   }
   export default nextConfig
   ```

2. Review `tsconfig.json` for production settings

3. Check `.gitignore` includes:
   ```
   .env.local
   .env
   node_modules/
   .next/
   ```

### Create Production Environment File

Create `.env.production` (without .local):
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Step 3: Set Up CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

## Step 4: Add GitHub Secrets (Optional for Auto-Deploy)

1. Go to your repo Settings
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add `VERCEL_TOKEN`:
   - Get from [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Generate new token
   - Paste in GitHub secret

## Step 5: Create Documentation Files

Your repo should include these files (already created):

- **README.md** - Main documentation
- **SETUP_GUIDE.md** - Installation guide
- **GITHUB_DEPLOYMENT.md** - This file
- **.gitignore** - Don't commit sensitive files
- **LICENSE** - Choose MIT or your preference

## Step 6: Deploy to Vercel

### Option A: Auto-Deploy from GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Choose "Import Git Repository"
4. Paste your GitHub URL
5. Click "Continue"
6. Select "Next.js" framework
7. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Click "Deploy"

Your app will auto-deploy on every push to main!

### Option B: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel --prod

# Follow the prompts
```

## Step 7: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your domain:
   - Use registrar's DNS settings
   - Add CNAME record pointing to Vercel
   - Wait 24-48 hours for propagation

## Step 8: Enable Auto-Deployments

1. In Vercel, go to **Settings** → **Git**
2. Ensure "Automatic deployments" is enabled for main branch
3. Set "Preview deployments" for pull requests

## Step 9: Monitor Your Deployment

### Vercel Analytics

1. In Vercel dashboard, check:
   - **Deployments** - See all deploys and status
   - **Analytics** - Track performance
   - **Logs** - Debug issues
   - **Monitoring** - Check uptime

### GitHub Workflows

1. Go to your repo
2. Click **Actions** tab
3. See deployment status
4. Click on runs for detailed logs

## Step 10: Update After Changes

### Making Updates

```bash
# Make changes to code
git add .
git commit -m "Add new feature"
git push origin main

# Automatic deployment starts on Vercel
# Check Deployments tab to monitor
```

### Rollback if Needed

1. Go to Vercel Deployments tab
2. Find previous deployment
3. Click three dots (•••)
4. Click "Promote to Production"

## Step 11: Security Checklist

- [ ] Never commit `.env.local` to GitHub
- [ ] Use `.env.production` only for production secrets
- [ ] Add secrets to GitHub and Vercel safely
- [ ] Enable branch protection rules
- [ ] Require PR reviews before merge
- [ ] Use strong passwords for Supabase
- [ ] Enable 2FA on GitHub and Vercel
- [ ] Monitor Supabase for suspicious activity

## Step 12: Continuous Improvement

### Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Or use npm-check-updates
npx npm-check-updates -u
npm install
```

### Regular Maintenance

- Review logs for errors
- Monitor performance metrics
- Update documentation
- Test deployment process
- Back up Supabase regularly

## Troubleshooting

### Build Fails on Vercel

Check logs in Vercel dashboard:
1. Deployments → Failed deploy
2. View logs for error messages
3. Common issues:
   - Missing env vars
   - TypeScript errors
   - Dependency conflicts

### App Crashes After Deploy

1. Check Vercel monitoring
2. Review server logs
3. Check Supabase status
4. Verify environment variables
5. Rollback to previous version

### Slow Performance

1. Check Vercel Analytics
2. Profile with Lighthouse
3. Optimize images
4. Reduce bundle size
5. Cache database queries

## Pro Tips

1. **Use Preview Deployments**
   - Create a branch to test changes
   - Vercel creates preview URL
   - Get feedback before merging

2. **Set Up Staging Environment**
   - Create staging branch
   - Deploy to staging Supabase project
   - Test before production

3. **Enable Secrets Rotation**
   - Rotate Supabase keys periodically
   - Update in GitHub and Vercel
   - Monitor for unauthorized access

4. **Automated Testing**
   - Add unit tests
   - Run tests in CI/CD
   - Prevent broken code from deploying

---

Your SecureBank app is now deployed and ready for production!

For updates and support, refer to the main README.md file.
