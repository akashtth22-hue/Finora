"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  transaction?: {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string | null;
    date: string;
  } | null;
};

export default function AddTransactionModal({
  open,
  onClose,
  transaction,
}: Props) {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState(
    transaction?.amount?.toString() || ""
  );

  const [type, setType] = useState(
    transaction?.type || "EXPENSE"
  );

  const [category, setCategory] = useState(
    transaction?.category || ""
  );

  const [description, setDescription] = useState(
    transaction?.description || ""
  );

  const [date, setDate] = useState(
    transaction?.date?.split("T")[0] || ""
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setDescription(transaction.description || "");
      setDate(transaction.date.split("T")[0]);
    } else {
      setAmount("");
      setType("EXPENSE");
      setCategory("");
      setDescription("");
      setDate("");
    }
  }, [transaction, open]);

  async function handleSave() {
    if (!amount || !category || !date) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        transaction
          ? `/api/transactions/${transaction.id}`
          : "/api/transactions",
        {
          method: transaction ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(amount),
            type,
            category,
            description,
            date,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        transaction
          ? "Transaction updated successfully."
          : "Transaction added successfully."
      );

      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
      setType("EXPENSE");

      onClose();

      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">

      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                {transaction
                  ? "Edit Transaction"
                  : "Add Transaction"}
              </h2>

              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-600">
                {transaction ? "Edit" : "New"}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-gray-500">
              {transaction
                ? "Update your transaction details."
                : "Record your income or expense."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 active:scale-95"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                ₹
              </span>

              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  type === "EXPENSE"
                    ? "bg-white text-red-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  type === "INCOME"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Salary">Salary</option>
              <option value="Bills">Bills</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
              <span className="ml-1 text-xs font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              placeholder="What was this transaction for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

        </div>

        {/* Actions */}
        <div className="mt-7 grid grid-cols-2 gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="h-12 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="h-12 rounded-xl bg-purple-600 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : transaction
                ? "Update Transaction"
                : "Save Transaction"}
          </button>

        </div>

      </div>
    </div>
  );
}