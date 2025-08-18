"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction } from "@/types";

interface SpendingBreakdownChartProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
];

export function SpendingBreakdownChart({ transactions, isLoading }: SpendingBreakdownChartProps) {
  // Calculate spending by category (only expenses)
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

  // Convert to chart data format
  const chartData = Object.entries(spendingByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Sort by amount (highest first)
  chartData.sort((a, b) => b.value - a.value);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No spending data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value),
                  'Amount'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top spending categories summary */}
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Top Categories:</h4>
          {chartData.slice(0, 3).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
