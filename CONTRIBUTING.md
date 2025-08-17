# 🤝 Contributing to Personal Finance Tracker

Thank you for your interest in contributing to our Personal Finance Tracker! This document provides guidelines and best practices for our development team.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account
- Code editor (VS Code recommended)

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd personal-finance-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Verify Setup**
   ```bash
   npm run dev
   npm test
   ```

## 🔄 Development Workflow

### Branching Strategy

We follow a simplified Git Flow approach:

```
main (production)
├── develop (integration)
├── feature/user-dashboard
├── feature/transaction-form
├── fix/login-bug
└── chore/update-deps
```

#### Branch Types

- **`main`**: Production-ready code (auto-deploys to Vercel)
- **`develop`**: Integration branch for testing features
- **`feature/*`**: New features and enhancements
- **`fix/*`**: Bug fixes and patches
- **`chore/*`**: Maintenance tasks, dependency updates
- **`docs/*`**: Documentation updates
- **`test/*`**: Adding or improving tests

#### Branch Naming Convention

```
feature/user-authentication
feature/expense-tracking
fix/login-redirect-issue
chore/update-eslint-config
docs/api-documentation
test/user-service-tests
```

### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user authentication form"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

## 📝 Code Standards

### TypeScript

- **Strict Mode**: Always enabled
- **Type Everything**: No `any` types
- **Interfaces**: Use interfaces for object shapes
- **Generics**: Use when appropriate for reusable components

```typescript
// ✅ Good
interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
}

// ❌ Bad
const UserComponent = ({ user, onUpdate }: any) => {
  // ...
};
```

### React Components

- **Functional Components Only**: No class components
- **Hooks**: Use custom hooks for complex logic
- **Props Interface**: Always define prop types
- **Single Responsibility**: One component, one purpose

```typescript
// ✅ Good
interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionCard({ 
  transaction, 
  onEdit, 
  onDelete 
}: TransactionCardProps) {
  // Component logic
}
```

### File Structure

- **Components**: `src/components/ComponentName.tsx`
- **Hooks**: `src/hooks/useHookName.ts`
- **API**: `src/api/resourceName.ts`
- **Types**: `src/types/index.ts`
- **Tests**: `src/tests/components/ComponentName.test.tsx`

### Import/Export

- **Absolute Imports**: Use `@/` alias
- **Named Exports**: Prefer named exports
- **Default Exports**: Only for page components

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { getTransactions } from "@/api/transactions";

// ❌ Bad
import Button from "../../../components/ui/button";
```

### API Layer Rules

**CRITICAL**: Never call Supabase directly in components!

```typescript
// ✅ Good - Use API layer
import { getTransactions } from "@/api/transactions";

const { transactions, loading } = useTransactions(userId);

// ❌ Bad - Direct Supabase calls
import { supabase } from "@/lib/supabaseClient";

const { data } = await supabase.from("transactions").select("*");
```

## 🧪 Testing Guidelines

### Test Requirements

- **Coverage**: Aim for 80%+ code coverage
- **Components**: Test all new components
- **Hooks**: Test custom hooks thoroughly
- **API Functions**: Test error handling

### Test Structure

```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    render(<ComponentName />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    // Assert expected behavior
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx
```

## 🔀 Pull Request Process

### Before Creating PR

1. **Code Quality**
   - All tests pass
   - No linting errors
   - Code follows our standards
   - Documentation updated

2. **Self Review**
   - Review your own code
   - Test functionality manually
   - Check for obvious issues

### PR Creation

1. **Title**: Clear, descriptive title
2. **Description**: Explain what and why (not how)
3. **Linked Issues**: Reference related issues
4. **Screenshots**: If UI changes
5. **Testing Steps**: How to test the changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

## 👀 Code Review Guidelines

### Review Process

1. **Automated Checks**
   - CI/CD pipeline passes
   - Code coverage maintained
   - No security vulnerabilities

2. **Manual Review**
   - Code quality and readability
   - Performance considerations
   - Security implications
   - Test coverage

### Review Comments

- **Constructive**: Focus on improvement, not criticism
- **Specific**: Point to exact lines and explain why
- **Actionable**: Suggest specific solutions
- **Respectful**: Maintain professional tone

### Review Checklist

- [ ] Code follows project standards
- [ ] Tests are comprehensive
- [ ] Error handling is appropriate
- [ ] Performance is acceptable
- [ ] Security is considered
- [ ] Documentation is updated

## 🚫 What Not to Do

- **Don't** commit directly to `main`
- **Don't** skip code reviews
- **Don't** ignore failing tests
- **Don't** use `any` types in TypeScript
- **Don't** call Supabase directly in components
- **Don't** commit large files or dependencies
- **Don't** ignore linting errors

## 🆘 Getting Help

### Questions and Issues

- **Git Issues**: Check Git documentation first
- **Code Problems**: Search existing issues
- **Feature Requests**: Create detailed issue
- **General Questions**: Ask in team chat

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📈 Continuous Improvement

We're always looking to improve our development process:

- **Suggestions**: Open issues for process improvements
- **Feedback**: Share your experience and ideas
- **Documentation**: Help improve our docs
- **Mentoring**: Help onboard new team members

---

**Thank you for contributing! 🎉**

Your contributions help make our Personal Finance Tracker better for everyone.
