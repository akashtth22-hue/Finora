"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import AddBudgetModal from "./AddBudgetModal";
import DeleteBudgetModal from "./DeleteBudgetModal";

type Budget = {
  id: string;
  category: string;
  amount: number;
  month: string;
  spent: number;
  remaining: number;
  progress: number;
  isOverBudget: boolean;
};

export default function BudgetContent() {
  const queryClient = useQueryClient();

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [open, setOpen] = useState(false);

  const [selectedBudget, setSelectedBudget] =
    useState<Budget | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const {
    data: budgets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Budget[]>({
    queryKey: ["budgets", month],

    queryFn: async () => {
      const response = await fetch(
        `/api/budgets?month=${month}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }

      const data = await response.json();

      return data.budgets;
    },
  });

  const totalBudget = budgets.reduce(
    (total, budget) =>
      total + Number(budget.amount),
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) =>
      total + Number(budget.spent),
    0
  );

  const totalRemaining =
    totalBudget - totalSpent;

  const formattedMonth = new Date(
    `${month}-01T00:00:00`
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  function changeMonth(direction: number) {
    const [year, monthNumber] = month
      .split("-")
      .map(Number);

    const date = new Date(
      year,
      monthNumber - 1 + direction,
      1
    );

    const newMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    setMonth(newMonth);
  }

  function handleEdit(budget: Budget) {
    setSelectedBudget(budget);
    setOpen(true);
  }

  function handleAdd() {
    setSelectedBudget(null);
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
    setSelectedBudget(null);
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `/api/budgets/${deleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Failed to delete budget."
        );
        return;
      }

      toast.success(
        "Budget deleted successfully."
      );

      await queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });
    } catch (error) {
      console.error(error);
      toast.error(
        "Something went wrong."
      );
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Budget
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your monthly spending limits.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 sm:w-auto"
        >
          + Add Budget
        </button>

      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">

        <button
          onClick={() => changeMonth(-1)}
          className="rounded-xl px-4 py-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
        >
          ←
        </button>

        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          {formattedMonth}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="rounded-xl px-4 py-2 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
        >
          →
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Budget
          </p>

          <h2 className="mt-2 text-2xl font-bold text-purple-600">
            ₹{totalBudget.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Spent
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-500">
            ₹{totalSpent.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <h2
            className={`mt-2 text-2xl font-bold ${
              totalRemaining >= 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            ₹{totalRemaining.toLocaleString("en-IN")}
          </h2>
        </div>

      </div>

      {/* Budgets */}
      <div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Monthly Budgets
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track how much you're spending in each category.
          </p>
        </div>

        {/* Error */}
        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">

            <h3 className="text-lg font-semibold text-red-700">
              Failed to load budgets
            </h3>

            <p className="mt-2 text-sm text-red-600">
              Something went wrong while loading your budgets.
            </p>

            <button
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        ) : isLoading ? (

          <div className="py-16 text-center text-gray-500">
            Loading budgets...
          </div>

        ) : budgets.length === 0 ? (

          /* Empty State */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">

            <h3 className="text-lg font-semibold text-gray-900">
              No budgets for {formattedMonth}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first category budget to start
              tracking your spending.
            </p>

            <button
              onClick={handleAdd}
              className="mt-6 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              + Add Budget
            </button>

          </div>

        ) : (

          /* Budget Cards */
          <div className="space-y-4">

            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  {/* Budget Info */}
                  <div className="min-w-0">

                    <h3 className="text-lg font-semibold text-gray-900">
                      {budget.category}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹
                      {Number(
                        budget.spent
                      ).toLocaleString("en-IN")}
                      {" "}
                      of
                      {" "}
                      ₹
                      {Number(
                        budget.amount
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                  {/* Actions + Percentage */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end">

                    <span
                      className={`text-sm font-semibold ${
                        budget.isOverBudget
                          ? "text-red-600"
                          : "text-purple-600"
                      }`}
                    >
                      {Math.round(
                        budget.progress
                      )}
                      %
                    </span>

                    <button
                      onClick={() =>
                        handleEdit(budget)
                      }
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      title="Edit Budget"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(budget.id)
                      }
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete Budget"
                    >
                      🗑️
                    </button>

                  </div>

                </div>

                {/* Progress */}
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className={`h-full rounded-full transition-all ${
                      budget.isOverBudget
                        ? "bg-red-500"
                        : "bg-purple-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        budget.progress,
                        100
                      )}%`,
                    }}
                  />

                </div>

                {/* Remaining */}
                <div className="mt-3 flex items-center justify-between text-sm">

                  <span className="text-gray-500">
                    {budget.isOverBudget
                      ? "Over budget"
                      : "Remaining"}
                  </span>

                  <span
                    className={`font-semibold ${
                      budget.isOverBudget
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    ₹
                    {Math.abs(
                      Number(
                        budget.remaining
                      )
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Add / Edit Modal */}
      <AddBudgetModal
        open={open}
        onClose={handleCloseModal}
        budget={selectedBudget}
      />

      {/* Delete Modal */}
      <DeleteBudgetModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

    </div>
  );
}