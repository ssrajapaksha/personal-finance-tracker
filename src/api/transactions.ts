import { prisma } from "@/lib/prisma";
import { Transaction, TransactionType } from "@/types";

export interface CreateTransactionData {
  userId: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: Date;
}

export interface UpdateTransactionData {
  amount?: number;
  description?: string;
  category?: string;
  type?: TransactionType;
  date?: Date;
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return transactions;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw new Error("Unable to fetch transactions");
  }
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    return transaction;
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    throw new Error("Unable to fetch transaction");
  }
}

export async function createTransaction(data: CreateTransactionData): Promise<Transaction> {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        description: data.description,
        category: data.category,
        type: data.type,
        date: data.date,
      },
    });
    return transaction;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw new Error("Unable to create transaction");
  }
}

export async function updateTransaction(id: string, data: UpdateTransactionData): Promise<Transaction> {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data,
    });
    return transaction;
  } catch (error) {
    console.error("Failed to update transaction:", error);
    throw new Error("Unable to update transaction");
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await prisma.transaction.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw new Error("Unable to delete transaction");
  }
}

export async function getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId,
        category 
      },
      orderBy: { date: 'desc' },
    });
    return transactions;
  } catch (error) {
    console.error("Failed to fetch transactions by category:", error);
    throw new Error("Unable to fetch transactions by category");
  }
}

export async function getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        }
      },
      orderBy: { date: 'desc' },
    });
    return transactions;
  } catch (error) {
    console.error("Failed to fetch transactions by date range:", error);
    throw new Error("Unable to fetch transactions by date range");
  }
}
