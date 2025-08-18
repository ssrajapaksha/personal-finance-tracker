"use client";

// Disable prerendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState } from "react";
import { SimpleTransactionForm } from "@/components/transactions/SimpleTransactionForm";
import { CreateTransactionRequest } from "@/schemas/transaction";

export default function TestTransactionPage() {
  const [showForm, setShowForm] = useState(false);
  const [submittedData, setSubmittedData] = useState<CreateTransactionRequest | null>(null);

  const handleSubmit = async (data: CreateTransactionRequest) => {
    console.log("Test form submitted:", data);
    setSubmittedData(data);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Transaction Form Test</h1>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Show Transaction Form
          </button>
        )}

        {showForm && (
          <div className="mt-8">
            <SimpleTransactionForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={false}
            />
          </div>
        )}

        {submittedData && (
          <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded">
            <h2 className="font-bold text-green-800">Form Submitted Successfully!</h2>
            <pre className="mt-2 text-sm text-green-700">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
