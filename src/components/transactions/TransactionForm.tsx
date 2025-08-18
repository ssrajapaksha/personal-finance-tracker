"use client";

// import { useState } from "react"; // Removed unused import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types";
import { CreateTransactionSchema, CreateTransactionRequest } from "@/schemas/transaction";

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Utilities",
  "Housing",
  "Salary",
  "Freelance",
  "Investment",
  "Other"
];

export function TransactionForm({ onSubmit, onCancel, isLoading = false }: TransactionFormProps) {
  const form = useForm<CreateTransactionRequest>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: CreateTransactionRequest) => {
    try {
      console.log("Form submitted with data:", data);
      console.log("Form type value:", data.type);
      
      // Ensure amount is a number
      const processedData = {
        ...data,
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
      };
      
      console.log("Processed data being sent:", processedData);
      
      await onSubmit(processedData);
      form.reset();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Debug Info */}
                            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                    Debug: Form type = &quot;{form.watch("type")}&quot;
                  </div>
          
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value: TransactionType) => {
                console.log("Select changed to:", value);
                form.setValue("type", value.toLowerCase() as 'income' | 'expense');
                console.log("Form type after setValue:", form.getValues("type"));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...form.register("amount", { valueAsNumber: true })}
              className={form.formState.errors.amount ? "border-red-500" : ""}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="What was this transaction for?"
              {...form.register("description")}
              className={form.formState.errors.description ? "border-red-500" : ""}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              className={form.formState.errors.date ? "border-red-500" : ""}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500">
                {form.formState.errors.date.message}
              </p>
            )}
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
