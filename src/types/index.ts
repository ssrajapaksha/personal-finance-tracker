// Import Prisma types directly to avoid conflicts
import type { 
  User as PrismaUser, 
  Transaction as PrismaTransaction, 
  Category as PrismaCategory, 
  FinancialGoal as PrismaFinancialGoal,
  TransactionType,
  GoalStatus
} from '@prisma/client'

// Re-export with aliases
export type User = PrismaUser
export type Transaction = PrismaTransaction
export type Category = PrismaCategory
export type FinancialGoal = PrismaFinancialGoal
export type { TransactionType, GoalStatus }

// Additional types that extend Prisma types
export interface TransactionWithCategoryDetails extends PrismaTransaction {
  categoryDetails?: PrismaCategory
}

export interface FinancialGoalWithProgress extends PrismaFinancialGoal {
  progressPercentage: number
  daysRemaining?: number
}

// Dashboard stats
export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netWorth: number
  monthlyBudget: number
  goalsProgress: FinancialGoalWithProgress[]
  recentTransactions: TransactionWithCategoryDetails[]
}
