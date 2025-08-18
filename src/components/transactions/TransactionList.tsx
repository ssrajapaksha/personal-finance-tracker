"use client";

import { useState } from "react";
import { Transaction, TransactionType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => Promise<void>;
  onAddNew: () => void;
  isLoading?: boolean;
}

export function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete, 
  onAddNew, 
  isLoading = false 
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (transactionId: string) => {
    try {
      setDeletingId(transactionId);
      await onDelete(transactionId);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    // Ensure amount is a number
    const numericAmount = Number(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
    
    // Convert to lowercase for comparison since database returns uppercase
    const normalizedType = type.toLowerCase();
    return normalizedType === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const getTypeIcon = (type: TransactionType) => {
    // Convert to lowercase for comparison since database returns uppercase
    const normalizedType = type.toLowerCase();
    return normalizedType === 'income' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTypeColor = (type: TransactionType) => {
    // Convert to lowercase for comparison since database returns uppercase
    const normalizedType = type.toLowerCase();
    return normalizedType === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Button onClick={onAddNew} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No transactions yet</p>
            <Button onClick={onAddNew} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getTypeIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{transaction.category}</Badge>
                      <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold text-lg ${getTypeColor(transaction.type)}`}>
                                         {formatAmount(Number(transaction.amount), transaction.type)}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
