import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
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
                <Button className="w-full">Get Started</Button>
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
                <Button className="w-full" variant="outline">View Reports</Button>
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
                <Button className="w-full" variant="outline">Create Goal</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>🚀 Ready to Get Started?</CardTitle>
              <CardDescription>
                This is a starter template for your personal finance tracking application. 
                Your team can now build upon this foundation to add real functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button size="lg">Start Tracking</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
