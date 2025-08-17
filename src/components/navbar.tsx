import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">💰 Personal Finance Tracker</h1>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
