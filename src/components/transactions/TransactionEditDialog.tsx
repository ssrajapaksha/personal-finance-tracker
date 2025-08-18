"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction, TransactionType } from "@/types";
import { UpdateTransactionSchema, UpdateTransactionRequest } from "@/schemas/transaction";

interface TransactionEditDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateTransactionRequest) => Promise<void>;
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

export function TransactionEditDialog({ 
  transaction, 
  isOpen, 
  onClose, 
  onSave, 
  isLoading = false 
}: TransactionEditDialogProps) {
  const form = useForm<UpdateTransactionRequest>({
    resolver: zodResolver(UpdateTransactionSchema),
    defaultValues: {
      id: "",
      amount: 0,
      description: "",
      category: "",
      type: "expense",
      date: "",
    },
  });

  // Update form when transaction changes
  useEffect(() => {
    if (transaction) {
      // Convert database type (INCOME/EXPENSE) to form type (income/expense)
      const formType = transaction.type.toLowerCase() as 'income' | 'expense';
      
      console.log('Loading transaction for edit:', {
        databaseType: transaction.type,
        formType: formType,
      });
      
      form.reset({
        id: transaction.id,
        amount: Number(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        type: formType,
        date: new Date(transaction.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
      });
    }
  }, [transaction, form]);

  const handleSubmit = async (data: UpdateTransactionRequest) => {
    try {
      console.log("Edit form submitted with data:", data);
      console.log("Form type value:", data.type);
      
      await onSave(data);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        
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
                        form.setValue("type", value.toLowerCase() as 'income' | 'expense');
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
              onClick={handleClose}
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
