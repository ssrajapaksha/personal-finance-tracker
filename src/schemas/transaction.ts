import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255, "Description too long"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, "Date is required"),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial().extend({
  id: z.string().min(1, "Transaction ID is required"),
});

export type CreateTransactionRequest = z.infer<typeof CreateTransactionSchema>;

// Schema for API requests that includes userId
export const CreateTransactionAPIRequestSchema = CreateTransactionSchema.extend({
  userId: z.string().min(1, "User ID is required"),
});

export type CreateTransactionAPIRequest = z.infer<typeof CreateTransactionAPIRequestSchema>;
export type UpdateTransactionRequest = z.infer<typeof UpdateTransactionSchema>;
