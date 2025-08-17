import { useState, useEffect } from "react";
import { getTransactions } from "@/api/transactions";
import { Transaction } from "@/types";

export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactions(userId);
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const refetch = async () => {
    if (userId) {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactions(userId);
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
  };

  return { transactions, loading, error, refetch };
}
