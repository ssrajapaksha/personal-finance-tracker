"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimpleTransactionFormProps {
  onSubmit: (data: { amount: number; description: string; category: string; type: string; date: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SimpleTransactionForm({ onSubmit, onCancel, isLoading = false }: SimpleTransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Simple form submitted:", formData);
    
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add Transaction (Simple)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="What was this transaction for?"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
