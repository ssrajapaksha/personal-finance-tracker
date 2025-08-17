import { supabase } from "@/lib/supabaseClient";
import { Transaction } from "@/types";

export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw new Error("Unable to load transactions");
  }
}

export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw new Error("Unable to create transaction");
  }
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to update transaction:", error);
    throw new Error("Unable to update transaction");
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw new Error("Unable to delete transaction");
  }
}
