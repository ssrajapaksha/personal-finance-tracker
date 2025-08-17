# 💰 Personal Finance Tracker

A modern, full-stack personal finance tracking application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Beautiful UI**: shadcn/ui components with dark/light mode support
- **Real-time Database**: Supabase with PostgreSQL
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript coverage
- **Testing Ready**: Jest + React Testing Library setup

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- GitHub account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd personal-finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout with theme provider
│   └── page.tsx        # Home page
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── navbar.tsx      # Navigation component
│   ├── theme-toggle.tsx # Dark/light mode toggle
│   └── theme-provider.tsx # Theme context provider
├── lib/                 # Utilities and configurations
│   ├── supabaseClient.ts # Supabase client setup
│   └── utils.ts        # Helper functions
├── api/                 # API abstraction layer
│   └── transactions.ts  # Transaction API functions
├── hooks/               # Custom React hooks
│   └── useTransactions.ts # Transactions state management
├── types/               # TypeScript interfaces
│   └── index.ts        # Main type definitions
└── tests/               # Test files
    └── components/      # Component tests
```

## 🔧 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Automatic code formatting
- **Components**: Functional components with hooks only
- **Imports**: Absolute imports from `@/` alias

### Adding New Components

1. Create component in `src/components/`
2. Add TypeScript interfaces for props
3. Use shadcn/ui components when possible
4. Add tests in `src/tests/components/`

### API Layer

All database calls go through the `src/api/` layer:

```typescript
import { getTransactions } from "@/api/transactions";

// ✅ Good - use API layer
const transactions = await getTransactions(userId);

// ❌ Bad - direct Supabase calls in components
const { data } = await supabase.from("transactions").select("*");
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add your Supabase credentials in Vercel dashboard
3. **Auto-deploy**: Commits to `main` branch automatically deploy
4. **Preview Deployments**: Feature branches get preview URLs

### Environment Variables in Vercel

Add these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Team Collaboration

### Branching Strategy

- **`main`**: Production branch (auto-deploys to Vercel)
- **`feature/*`**: Feature development branches
- **`fix/*`**: Bug fix branches
- **`chore/*`**: Maintenance and dependency updates

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit with conventional commit messages
3. Push branch and create Pull Request
4. Request review from team members
5. Merge only after approval

### Conventional Commits

```
feat: add transaction creation form
fix: resolve login redirect issue
chore: update dependencies
docs: update README setup instructions
test: add user service tests
```

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Common Issues

**Environment Variables Not Working**
- Ensure `.env.local` exists and has correct values
- Restart development server after adding env vars

**Supabase Connection Issues**
- Verify URL and key in Supabase dashboard
- Check if your IP is allowed in Supabase settings

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

---

**Happy coding! 🎉**
