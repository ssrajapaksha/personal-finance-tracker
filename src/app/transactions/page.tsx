"use client";

import { useState, useEffect, useCallback } from "react";
import { MainNav } from "@/components/navigation/MainNav";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionEditDialog } from "@/components/transactions/TransactionEditDialog";
import { Transaction } from "@/types";
import { CreateTransactionRequest, UpdateTransactionRequest } from "@/schemas/transaction";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("TransactionsPage render - user:", user, "authLoading:", authLoading);

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      if (user) {
        const response = await fetch(`/api/transactions?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Loaded transactions from API:", data);
          console.log("Transaction types:", data.map((t: Transaction) => ({ id: t.id, type: t.type, description: t.description })));
          setTransactions(data);
        } else {
          console.error("Failed to load transactions:", response.status);
        }
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleCreateTransaction = async (data: CreateTransactionRequest) => {
    try {
      console.log("handleCreateTransaction called with:", data);
      console.log("User ID:", user?.id);
      
      setIsSubmitting(true);
      const requestBody = {
        ...data,
        userId: user!.id,
      };
      console.log("Request body:", requestBody);
      
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const newTransaction = await response.json();
        console.log("New transaction created:", newTransaction);
        setTransactions(prev => [newTransaction, ...prev]);
        setShowForm(false);
      } else {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || 'Failed to create transaction');
      }
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTransaction = async (data: UpdateTransactionRequest) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/transactions/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const updatedTransaction = await response.json();
        setTransactions(prev => 
          prev.map(t => t.id === data.id ? updatedTransaction : t)
        );
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      throw error;
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleAddNew = () => {
    console.log("Add Transaction button clicked");
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTransaction(null);
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to view transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Track your income and expenses
              </p>
            </div>
            
            {!showForm && (
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            )}
          </div>

          {/* Transaction Form */}
          {showForm && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelForm}
                  className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
                <TransactionForm
                  onSubmit={handleCreateTransaction}
                  onCancel={handleCancelForm}
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onAddNew={handleAddNew}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Edit Dialog */}
      <TransactionEditDialog
        transaction={editingTransaction}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateTransaction}
        isLoading={isSubmitting}
      />
    </div>
  );
}
