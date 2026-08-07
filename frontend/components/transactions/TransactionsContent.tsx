"use client";

import { useState } from "react";

import TransactionSummary from "./TransactionSummary";
import TransactionToolbar from "./TransactionToolbar";
import TransactionList from "./TransactionList";
import AddTransactionModal from "./AddTransactionModal";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category: string;
  description: string | null;
  date: string;
};

export default function TransactionsContent({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Transactions
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all your income and expenses.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
        >
          + Add Transaction
        </button>
      </div>

      <div className="mb-8">
        <TransactionSummary />
      </div>

      <TransactionToolbar />

      <TransactionList transactions={transactions} />

      <AddTransactionModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}