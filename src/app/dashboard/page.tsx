"use client";

// Disable prerendering for this page
export const dynamic = 'force-dynamic';

import { MainNav } from "@/components/navigation/MainNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, Target, Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { Transaction } from "@/types";
import { SpendingBreakdownChart } from "@/components/dashboard/SpendingBreakdownChart";
import { MonthlyTrendsChart } from "@/components/dashboard/MonthlyTrendsChart";
import { FinancialInsights } from "@/components/dashboard/FinancialInsights";


export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    try {
      console.log("Dashboard: Loading transactions for user:", user?.id);
      setIsLoading(true);
      if (user) {
        const response = await fetch(`/api/transactions?userId=${user.id}`);
        console.log("Dashboard: API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard: Loaded transactions:", data);
          console.log("Dashboard: Transaction types:", data.map((t: Transaction) => ({ id: t.id, type: t.type, description: t.description })));
          setTransactions(data);
        } else {
          console.error("Failed to load transactions:", response.status);
        }
      } else {
        console.log("Dashboard: No user, skipping transaction load");
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("Dashboard: useEffect triggered, user:", user);
    loadTransactions();
  }, [user, loadTransactions]);

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type.toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const currentBalance = totalIncome - totalExpenses;
  
  console.log("Dashboard: Financial calculations:", {
    totalIncome,
    totalExpenses,
    currentBalance,
    transactionCount: transactions.length,
    transactionTypes: transactions.map(t => t.type),
    transactionDetails: transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      amountType: typeof t.amount,
      description: t.description
    }))
  });
  
  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return t.type.toLowerCase() === 'income' && 
             transactionDate.getMonth() === now.getMonth() &&
             transactionDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return t.type.toLowerCase() === 'expense' && 
             transactionDate.getMonth() === now.getMonth() &&
             transactionDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Get recent transactions for the activity feed
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
        <MainNav />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome to Your Financial Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your spending, set goals, and build wealth
              </p>
            </div>

                         {/* Quick Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium text-primary">Total Balance</CardTitle>
                   <DollarSign className="h-4 w-4 text-primary" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-primary">
                     {isLoading ? "..." : new Intl.NumberFormat('en-US', {
                       style: 'currency',
                       currency: 'USD',
                     }).format(currentBalance)}
                   </div>
                   <p className="text-xs text-muted-foreground">
                     {isLoading ? "Loading..." : `${totalIncome > totalExpenses ? '+' : ''}${new Intl.NumberFormat('en-US', {
                       style: 'currency',
                       currency: 'USD',
                     }).format(totalIncome - totalExpenses)} total`}
                   </p>
                 </CardContent>
               </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(monthlyExpenses)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : "This month's expenses"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(monthlyIncome)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : "This month's income"}
                  </p>
                </CardContent>
              </Card>
            </div>

                         {/* Charts and Analytics Section */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <SpendingBreakdownChart transactions={transactions} isLoading={isLoading} />
               <MonthlyTrendsChart transactions={transactions} isLoading={isLoading} />
             </div>

             {/* Financial Insights */}
             <FinancialInsights transactions={transactions} isLoading={isLoading} />

             {/* Quick Actions */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Wallet className="h-5 w-5" />
                     <span>Add Transaction</span>
                   </CardTitle>
                   <CardDescription>
                     Record a new income or expense
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <Link href="/transactions">
                     <Button className="w-full">Add Transaction</Button>
                   </Link>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Target className="h-5 w-5" />
                     <span>Set Financial Goal</span>
                   </CardTitle>
                   <CardDescription>
                     Create a new savings target
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <Link href="/goals/new">
                     <Button className="w-full" variant="outline">Create Goal</Button>
                   </Link>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <BarChart3 className="h-5 w-5" />
                     <span>View Analytics</span>
                   </CardTitle>
                   <CardDescription>
                     See detailed spending insights
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <Link href="/analytics">
                     <Button className="w-full" variant="outline">View Reports</Button>
                   </Link>
                 </CardContent>
               </Card>
             </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading transactions...</p>
                    </div>
                  ) : recentTransactions.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.type.toLowerCase() === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium">{transaction.description}</span>
                        </div>
                        <span className={`font-medium ${
                          transaction.type.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type.toLowerCase() === 'income' ? '+' : '-'}
                                                     {new Intl.NumberFormat('en-US', {
                             style: 'currency',
                             currency: 'USD',
                           }).format(Number(transaction.amount))}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="/transactions">
                    <Button variant="outline">View All Transactions</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
}
