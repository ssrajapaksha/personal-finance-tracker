"use client";

import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Loading...</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If authenticated, show a different version of the landing page
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back to Your Personal Finance Tracker
              </h1>
              <p className="text-xl text-muted-foreground">
                Continue managing your finances and achieving your goals
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button size="lg" variant="outline">Profile Settings</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to Your Personal Finance Tracker
            </h1>
            <p className="text-xl text-muted-foreground">
              Take control of your financial future with our easy-to-use tracking tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>💰 Track Expenses</CardTitle>
                <CardDescription>
                  Monitor your daily spending and categorize expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 View Analytics</CardTitle>
                <CardDescription>
                  Visualize your spending patterns and financial trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth">
                  <Button className="w-full" variant="outline">View Reports</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Set Goals</CardTitle>
                <CardDescription>
                  Create and track your financial goals and milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth">
                  <Button className="w-full" variant="outline">Create Goal</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>🚀 Ready to Get Started?</CardTitle>
              <CardDescription>
                Join thousands of users who are already taking control of their finances. 
                Sign up today and start your journey to financial freedom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg">Start Tracking</Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
