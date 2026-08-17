"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Wallet,
  TrendingDown,
  CircleDollarSign,
  AlertTriangle,
  Target,
} from "lucide-react";

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

  const overallProgress =
    totalBudget > 0
      ? Math.min(
          (totalSpent / totalBudget) * 100,
          100
        )
      : 0;

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
    <div className="relative min-h-full overflow-hidden bg-[#faf9ff]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-500/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -left-40 top-[500px] h-96 w-96 rounded-full bg-violet-500/[0.04] blur-3xl" />

      <div className="relative space-y-7 p-1">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Target size={16} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-500">
                Spending control
              </span>

            </div>

            <h1 className="text-3xl font-black tracking-[-0.03em] text-gray-950 sm:text-4xl">
              Budget
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Take control of your monthly spending.
            </p>

          </div>

          <button
            onClick={handleAdd}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(124,58,237,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(124,58,237,0.30)]"
          >
            <Plus
              size={18}
              className="transition-transform duration-300 group-hover:rotate-90"
            />

            Add Budget
          </button>

        </div>

        {/* =========================================================
            MONTH SELECTOR
        ========================================================== */}

        <div className="flex items-center justify-between rounded-[22px] border border-gray-200/80 bg-white p-2 shadow-[0_10px_40px_rgba(30,20,60,0.04)]">

          <button
            onClick={() => changeMonth(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-all duration-300 hover:bg-purple-50 hover:text-purple-600"
          >
            <ChevronLeft size={19} />
          </button>

          <div className="text-center">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Selected period
            </p>

            <h2 className="mt-0.5 text-sm font-black text-gray-900 sm:text-base">
              {formattedMonth}
            </h2>

          </div>

          <button
            onClick={() => changeMonth(1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-all duration-300 hover:bg-purple-50 hover:text-purple-600"
          >
            <ChevronRight size={19} />
          </button>

        </div>

        {/* =========================================================
            SUMMARY CARDS
        ========================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Total Budget */}
          <div className="group relative overflow-hidden rounded-[26px] border border-gray-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(30,20,60,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(30,20,60,0.08)]">

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/[0.07] blur-2xl transition-transform duration-500 group-hover:scale-125" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Total Budget
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950">
                  ₹{totalBudget.toLocaleString("en-IN")}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <Wallet size={20} />
              </div>

            </div>

          </div>

          {/* Total Spent */}
          <div className="group relative overflow-hidden rounded-[26px] border border-gray-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(30,20,60,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(30,20,60,0.08)]">

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-500/[0.06] blur-2xl transition-transform duration-500 group-hover:scale-125" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Total Spent
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <TrendingDown size={20} />
              </div>

            </div>

          </div>

          {/* Remaining */}
          <div className="group relative overflow-hidden rounded-[26px] border border-gray-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(30,20,60,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(30,20,60,0.08)]">

            <div
              className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${
                totalRemaining >= 0
                  ? "bg-emerald-500/[0.06]"
                  : "bg-red-500/[0.07]"
              }`}
            />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Remaining
                </p>

                <h2
                  className={`mt-3 text-2xl font-black tracking-tight ${
                    totalRemaining >= 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  ₹{Math.abs(totalRemaining).toLocaleString("en-IN")}
                </h2>

              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  totalRemaining >= 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <CircleDollarSign size={20} />
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================
            OVERALL PROGRESS
        ========================================================== */}

        {budgets.length > 0 && (
          <div className="overflow-hidden rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(30,20,60,0.045)]">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Monthly spending
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Overall Budget Progress
                </h2>

              </div>

              <div className="text-left sm:text-right">

                <span
                  className={`text-2xl font-black ${
                    overallProgress >= 100
                      ? "text-red-500"
                      : "text-purple-600"
                  }`}
                >
                  {Math.round(overallProgress)}%
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Used
                </p>

              </div>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">

              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  overallProgress >= 100
                    ? "bg-red-500"
                    : "bg-gradient-to-r from-purple-600 to-violet-500"
                }`}
                style={{
                  width: `${overallProgress}%`,
                }}
              />

            </div>

            <div className="mt-3 flex justify-between text-xs">

              <span className="text-gray-500">
                ₹{totalSpent.toLocaleString("en-IN")} spent
              </span>

              <span className="font-semibold text-gray-700">
                ₹{totalBudget.toLocaleString("en-IN")} budget
              </span>

            </div>

          </div>
        )}

        {/* =========================================================
            BUDGETS
        ========================================================== */}

        <div>

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Category control
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950 sm:text-2xl">
                Monthly Budgets
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track every spending category.
              </p>

            </div>

            {budgets.length > 0 && (
              <span className="hidden rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-600 sm:block">
                {budgets.length} categories
              </span>
            )}

          </div>

          {/* ERROR */}
          {isError ? (
            <div className="rounded-[28px] border border-red-200 bg-red-50/70 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                <AlertTriangle size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-red-700">
                Failed to load budgets
              </h3>

              <p className="mt-2 text-sm text-red-600">
                Something went wrong while loading your budgets.
              </p>

              <button
                onClick={() => refetch()}
                className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          ) : isLoading ? (

            <div className="rounded-[28px] border border-gray-200 bg-white py-20 text-center shadow-sm">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading your budgets...
              </p>

            </div>

          ) : budgets.length === 0 ? (

            <div className="rounded-[28px] border border-dashed border-gray-300 bg-white py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
                <Target size={27} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                No budgets for {formattedMonth}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create category budgets to understand where your money is going and stay within your limits.
              </p>

              <button
                onClick={handleAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                <Plus size={17} />
                Add Budget
              </button>

            </div>

          ) : (

            <div className="grid gap-4 xl:grid-cols-2">

              {budgets.map((budget) => {

                const progress = Math.max(
                  0,
                  Number(budget.progress || 0)
                );

                return (
                  <div
                    key={budget.id}
                    className="group relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-[0_12px_45px_rgba(30,20,60,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-purple-100 hover:shadow-[0_22px_60px_rgba(30,20,60,0.08)]"
                  >

                    {/* Card glow */}
                    <div
                      className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125 ${
                        budget.isOverBudget
                          ? "bg-red-500/[0.06]"
                          : "bg-purple-500/[0.05]"
                      }`}
                    />

                    <div className="relative">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                budget.isOverBudget
                                  ? "bg-red-50 text-red-500"
                                  : "bg-purple-50 text-purple-600"
                              }`}
                            >
                              {budget.isOverBudget ? (
                                <AlertTriangle size={18} />
                              ) : (
                                <Wallet size={18} />
                              )}
                            </div>

                            <div className="min-w-0">

                              <h3 className="truncate text-base font-black text-gray-950">
                                {budget.category}
                              </h3>

                              <p className="mt-0.5 text-xs text-gray-400">
                                Monthly limit
                              </p>

                            </div>

                          </div>

                        </div>

                        <div className="flex items-center gap-1">

                          <button
                            onClick={() =>
                              handleEdit(budget)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-300 hover:bg-purple-50 hover:text-purple-600"
                            title="Edit Budget"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(budget.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                            title="Delete Budget"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </div>

                      {/* Amounts */}
                      <div className="mt-6 flex items-end justify-between gap-4">

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Spent
                          </p>

                          <p className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                            ₹{Number(
                              budget.spent
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Budget
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-700">
                            ₹{Number(
                              budget.amount
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>

                      {/* Progress */}
                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between">

                          <span
                            className={`text-xs font-bold ${
                              budget.isOverBudget
                                ? "text-red-500"
                                : "text-purple-600"
                            }`}
                          >
                            {Math.round(progress)}% used
                          </span>

                          <span
                            className={`text-[10px] font-semibold ${
                              budget.isOverBudget
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          >
                            {budget.isOverBudget
                              ? "Limit exceeded"
                              : "On track"}
                          </span>

                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">

                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              budget.isOverBudget
                                ? "bg-red-500"
                                : "bg-gradient-to-r from-purple-600 to-violet-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                progress,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* Bottom */}
                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                        <span className="text-xs text-gray-500">
                          {budget.isOverBudget
                            ? "Over budget"
                            : "Remaining"}
                        </span>

                        <span
                          className={`text-sm font-black ${
                            budget.isOverBudget
                              ? "text-red-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {budget.isOverBudget
                            ? "-"
                            : ""}
                          ₹{Math.abs(
                            Number(
                              budget.remaining
                            )
                          ).toLocaleString("en-IN")}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

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