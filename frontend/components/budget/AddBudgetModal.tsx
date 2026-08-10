"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

type Budget = {
  id: string;
  category: string;
  amount: number;
  month: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  budget?: Budget | null;
};

const categories = [
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Healthcare",
  "Entertainment",
];

export default function AddBudgetModal({
  open,
  onClose,
  budget,
}: Props) {
  const queryClient = useQueryClient();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(budget);

  useEffect(() => {
    if (!open) return;

    if (budget) {
      setCategory(budget.category);
      setAmount(String(budget.amount));
      setMonth(budget.month.slice(0, 7));
    } else {
      setCategory("");
      setAmount("");
      setMonth(new Date().toISOString().slice(0, 7));
    }
  }, [budget, open]);

  async function handleSave() {
    if (!category || !amount || !month) {
      toast.error("Please fill all required fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid budget amount.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        isEditing
          ? `/api/budgets/${budget!.id}`
          : "/api/budgets",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            category,
            amount: numericAmount,
            month,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            `Failed to ${isEditing ? "update" : "create"} budget.`
        );
        return;
      }

      toast.success(
        isEditing
          ? "Budget updated successfully."
          : "Budget created successfully."
      );

      await queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Budget" : "Add Budget"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update your monthly spending limit."
                : "Set a spending limit for a category."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Monthly Budget
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="1"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 p-3 pl-9 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Month */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Budget"
                : "Save Budget"}
          </button>

        </div>

      </div>
    </div>
  );
}