import { MainNav } from "@/components/navigation/MainNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, Target, Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function DashboardPage() {
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,450.00</div>
                  <p className="text-xs text-muted-foreground">
                    +$180.00 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,200.00</div>
                  <p className="text-xs text-muted-foreground">
                    -$50.00 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$3,650.00</div>
                  <p className="text-xs text-muted-foreground">
                    +$200.00 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

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
                  <Link href="/transactions/new">
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
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Grocery Shopping</span>
                    </div>
                    <span className="text-red-600 font-medium">-$85.50</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Salary Deposit</span>
                    </div>
                    <span className="text-green-600 font-medium">+$3,650.00</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Gas Station</span>
                    </div>
                    <span className="text-red-600 font-medium">-$45.00</span>
                  </div>
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
