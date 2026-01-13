secure-bank/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── sign-up/page.tsx        # Sign up page
│   │   └── sign-up-success/page.tsx # Email verification success
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout with nav
│   │   └── page.tsx                # Account overview
│   ├── transfer/
│   │   └── page.tsx                # Money transfer page
│   ├── transactions/
│   │   └── page.tsx                # Transaction history
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page (redirects to dashboard/login)
│   └── globals.css                 # Styling with Tailwind v4
│
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server-side Supabase client
│
├── components/
│   ├── dashboard-nav.tsx           # Navigation component
│   ├── theme-provider.tsx          # Theme setup
│   └── ui/                         # 50+ shadcn/ui components
│
├── scripts/
│   └── init_banking_schema.sql     # Database setup script
│
├── .github/workflows/
│   ├── deploy.yml                  # Auto-deploy to Vercel
│   └── lint.yml                    # CI/CD linting checks
│
├── Documentation/
│   ├── README.md                   # Project overview
│   ├── SETUP_GUIDE.md              # Local development guide
│   ├── GITHUB_SETUP.md             # GitHub deployment steps
│   └── GITHUB_DEPLOYMENT.md        # Detailed deployment info
│
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript config
├── next.config.mjs                 # Next.js config
└── components.json                 # shadcn/ui config# securebank
