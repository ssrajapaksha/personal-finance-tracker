"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from "lucide-react";
import { Transaction } from "@/types";

interface FinancialInsightsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function FinancialInsights({ transactions, isLoading }: FinancialInsightsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            <p>Add some transactions to see insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate insights
  const totalIncome = transactions
    .filter(t => t.type.toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentBalance = totalIncome - totalExpenses;
  
  // Top spending categories
  const spendingByCategory = transactions
    .filter(t => t.type.toLowerCase() === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Number(transaction.amount);
      
      if (acc[category]) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }
      
      return acc;
    }, {} as Record<string, number>);

  const topSpendingCategories = Object.entries(spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Monthly averages
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

  const monthlyNet = monthlyIncome - monthlyExpenses;
  const savingsRate = totalIncome > 0 ? ((currentBalance / totalIncome) * 100) : 0;

  // Generate insights
  const insights = [];
  
  if (monthlyExpenses > monthlyIncome) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      title: 'Spending Alert',
      message: 'Your expenses exceed your income this month',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    });
  }

  if (savingsRate >= 20) {
    insights.push({
      type: 'positive',
      icon: TrendingUp,
      title: 'Great Savings!',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    });
  } else if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      icon: TrendingDown,
      title: 'Low Savings Rate',
      message: `Consider increasing your savings rate (currently ${savingsRate.toFixed(1)}%)`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    });
  }

  if (topSpendingCategories.length > 0) {
    const topCategory = topSpendingCategories[0];
    const topCategoryPercentage = (topCategory[1] / totalExpenses) * 100;
    
    if (topCategoryPercentage > 40) {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Category Focus',
        message: `${topCategory[0]} represents ${topCategoryPercentage.toFixed(1)}% of your spending`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Financial Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className={`text-lg font-bold ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
              {savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Monthly Net</p>
            <p className={`text-lg font-bold ${monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(monthlyNet)}
            </p>
          </div>
        </div>

        {/* Top Spending Categories */}
        {topSpendingCategories.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Top Spending Categories</h4>
            <div className="space-y-2">
              {topSpendingCategories.map(([category, amount], index) => {
                const percentage = (amount / totalExpenses) * 100;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-red-500' : 
                        index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm">{category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Smart Insights</h4>
            <div className="space-y-2">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
                  >
                    <div className="flex items-start space-x-2">
                      <Icon className={`h-4 w-4 mt-0.5 ${insight.color}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${insight.color}`}>
                          {insight.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="text-xs p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
              Set Budget
            </button>
            <button className="text-xs p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
