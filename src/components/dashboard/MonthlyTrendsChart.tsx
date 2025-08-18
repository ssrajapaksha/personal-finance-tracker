"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction } from "@/types";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface MonthlyTrendsChartProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function MonthlyTrendsChart({ transactions, isLoading }: MonthlyTrendsChartProps) {
  // Generate last 6 months data
  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type.toLowerCase() === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      const expenses = monthTransactions
        .filter(t => t.type.toLowerCase() === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      months.push({
        month: format(monthStart, 'MMM yyyy'),
        income,
        expenses,
        net: income - expenses,
      });
    }
    
    return months;
  };

  const chartData = generateMonthlyData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No transaction data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Trends (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value)
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value),
                  name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net'
                ]}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#3B82F6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Monthly summary */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Avg Monthly Income</p>
            <p className="font-semibold text-green-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(
                chartData.reduce((sum, month) => sum + month.income, 0) / chartData.length
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Avg Monthly Expenses</p>
            <p className="font-semibold text-red-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(
                chartData.reduce((sum, month) => sum + month.expenses, 0) / chartData.length
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Best Month</p>
            <p className="font-semibold text-blue-600">
              {chartData.reduce((best, month) => 
                month.net > best.net ? month : best
              ).month}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
