"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CalendarDays,
  ChevronDown,
  Target,
  ArrowRight,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import StatCard from "@/components/dashboard/StatCard";
import AIInsight from "@/components/dashboard/AIInsight";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseChart from "@/components/dashboard/ExpenseChart";

/* =====================================================
   TYPES
===================================================== */

type TransactionType =
  | "INCOME"
  | "EXPENSE";

type DashboardTransaction = {
  id: string;
  title: string;
  category: string;
  type: TransactionType;
  amount: number;
  date: string;
};

type ExpenseCategory = {
  name: string;
  value: number;
  percentage: number;
};

type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  remaining: number;
  progress: number;
  deadline: string | null;
};

type DashboardResponse = {
  success: boolean;

  month: {
    year: number;
    month: number;
    label: string;
  };

  summary: {
    totalBalance: number;
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
  };

  changes: {
    income: number;
    expenses: number;
    savings: number;
  };

  expenseByCategory: ExpenseCategory[];

  recentTransactions: DashboardTransaction[];

  budget: {
    total: number;
    spent: number;
    remaining: number;
    usedPercentage: number;
    status:
    | "Healthy"
    | "Warning"
    | "Exceeded";
  };

  savingsGoal: SavingsGoal | null;

  savingsGoals: SavingsGoal[];

  aiInsight: {
    text: string;
    biggestExpense: ExpenseCategory | null;
    savingsRate: number;
  };
};

type MonthlyChartItem = {
  month: string;
  income: number;
  expenses: number;
};

/* =====================================================
   HELPERS
===================================================== */

function formatCurrency(
  value: number
): string {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatShortCurrency(
  value: number
): string {
  const amount = Number(value || 0);

  if (amount >= 100000) {
    return `₹${(
      amount / 100000
    ).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${Math.round(
      amount / 1000
    )}K`;
  }

  return `₹${Math.round(amount)}`;
}

/* =====================================================
   MONTHLY CHART

   Uses transactions returned from
   /api/transactions.
===================================================== */

function buildMonthlyChart(
  transactions: DashboardTransaction[]
): MonthlyChartItem[] {
  const now = new Date();

  const months: MonthlyChartItem[] =
    [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      month: date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      ),

      income: 0,
      expenses: 0,
    });
  }

  /*
   * Match transactions against
   * the six displayed months.
   */
  transactions.forEach(
    (transaction) => {
      const transactionDate =
        new Date(
          transaction.date
        );

      const monthDifference =
        (now.getFullYear() -
          transactionDate.getFullYear()) *
        12 +
        (now.getMonth() -
          transactionDate.getMonth());

      if (
        monthDifference < 0 ||
        monthDifference > 5
      ) {
        return;
      }

      const index =
        5 - monthDifference;

      const amount = Number(
        transaction.amount || 0
      );

      if (
        transaction.type ===
        "INCOME"
      ) {
        months[index].income +=
          amount;
      } else {
        months[index].expenses +=
          amount;
      }
    }
  );

  return months;
}

/* =====================================================
   PAGE
===================================================== */

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(
      null
    );

  const [
    allTransactions,
    setAllTransactions,
  ] = useState<
    DashboardTransaction[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD DASHBOARD
  ====================================================== */

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      /* ================= DASHBOARD ================= */

      const response =
        await fetch(
          "/api/dashboard",
          {
            method: "GET",
            credentials:
              "include",
            cache: "no-store",
          }
        );

      const result =
        (await response.json()) as DashboardResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          "message" in result &&
            typeof (
              result as {
                message?: unknown;
              }
            ).message ===
            "string"
            ? (
              result as {
                message: string;
              }
            ).message
            : "Unable to load dashboard."
        );
      }

      setDashboard(result);

      /* ================= TRANSACTIONS ================= */

      try {
        const transactionResponse =
          await fetch(
            "/api/transactions",
            {
              method: "GET",
              credentials:
                "include",
              cache: "no-store",
            }
          );

        if (
          transactionResponse.ok
        ) {
          const transactionResult =
            await transactionResponse.json();

          if (
            transactionResult.success &&
            Array.isArray(
              transactionResult.transactions
            )
          ) {
            setAllTransactions(
              transactionResult.transactions.map(
                (
                  transaction: {
                    id: string;
                    description?: string | null;
                    category: string;
                    type: TransactionType;
                    amount:
                    | number
                    | string;
                    date: string;
                  }
                ) => ({
                  id: transaction.id,

                  title:
                    transaction.description ||
                    transaction.category,

                  category:
                    transaction.category,

                  type:
                    transaction.type,

                  amount: Number(
                    transaction.amount
                  ),

                  date:
                    transaction.date,
                })
              )
            );
          } else {
            setAllTransactions(
              result.recentTransactions
            );
          }
        } else {
          setAllTransactions(
            result.recentTransactions
          );
        }
      } catch {
        setAllTransactions(
          result.recentTransactions
        );
      }
    } catch (err: unknown) {
      console.error(
        "Dashboard loading error:",
        err
      );

      if (
        err instanceof Error
      ) {
        setError(
          err.message
        );
      } else {
        setError(
          "Unable to load dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     INITIAL LOAD
  ====================================================== */

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =====================================================
     CHART DATA
  ====================================================== */

  const monthlyData =
    useMemo(
      () =>
        buildMonthlyChart(
          allTransactions
        ),
      [allTransactions]
    );

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={
                  index
                }
                className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            )
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[430px] animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />

          <div className="h-[430px] animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ====================================================== */

  if (error || !dashboard) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error ||
              "Dashboard data is unavailable."}
          </p>

          <button
            type="button"
            onClick={
              loadDashboard
            }
            className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     DATA
  ====================================================== */

  const {
    summary,
    changes,
    budget,
    savingsGoal,
  } = dashboard;

  /* =====================================================
     RENDER
  ====================================================== */

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* =================================================
                HEADER
            ================================================= */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Good morning, Akash! 👋
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Here's what's happening with your finances today.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700">
            <CalendarDays
              size={18}
              className="text-gray-500"
            />

            <span>
              {
                dashboard
                  .month
                  .label
              }
            </span>

            <ChevronDown
              size={16}
              className="text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* =================================================
                STAT CARDS
            ================================================= */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Balance"
          value={formatCurrency(
            summary.totalBalance
          )}
          change={`${changes.savings >= 0 ? "+" : ""}${changes.savings.toFixed(
            1
          )}% savings change`}
          positive={
            changes.savings >=
            0
          }
          icon={Wallet}
        />

        <StatCard
          title="Income"
          value={formatCurrency(
            summary.income
          )}
          change={`${changes.income >= 0 ? "+" : ""}${changes.income.toFixed(
            1
          )}% from last month`}
          positive={
            changes.income >=
            0
          }
          icon={
            TrendingUp
          }
        />

        <StatCard
          title="Expenses"
          value={formatCurrency(
            summary.expenses
          )}
          change={`${changes.expenses >= 0 ? "+" : ""}${changes.expenses.toFixed(
            1
          )}% from last month`}
          positive={
            changes.expenses <=
            0
          }
          icon={
            TrendingDown
          }
        />

        <StatCard
          title="Savings Rate"
          value={`${summary.savingsRate.toFixed(
            1
          )}%`}
          change={`${formatCurrency(
            summary.savings
          )} saved this month`}
          positive={
            summary.savings >=
            0
          }
          icon={
            PiggyBank
          }
        />
      </div>

      {/* =================================================
                MAIN GRID
            ================================================= */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* =================================================
                    LEFT
                ================================================= */}

        <div className="space-y-6 lg:col-span-2">

          {/* ================= INCOME VS EXPENSES ================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Income vs Expenses
                </h2>

                <div className="mt-2 flex items-center gap-5 text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    Income
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Expenses
                  </span>
                </div>
              </div>

              <span className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600">
                Last 6 months
              </span>
            </div>

            <div className="mt-6 h-[300px]">
              {allTransactions.length ===
                0 ? (
                <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 text-center">
                  <div>
                    <BarChart3
                      className="mx-auto text-gray-300"
                      size={
                        40
                      }
                    />

                    <p className="mt-3 text-sm font-medium text-gray-500">
                      Add transactions to see your trend.
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={
                      monthlyData
                    }
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={
                        false
                      }
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 12,
                      }}
                      axisLine={
                        false
                      }
                      tickLine={
                        false
                      }
                    />

                    <YAxis
                      tickFormatter={
                        formatShortCurrency
                      }
                      tick={{
                        fontSize: 11,
                      }}
                      axisLine={
                        false
                      }
                      tickLine={
                        false
                      }
                      width={
                        55
                      }
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value ?? 0))
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      strokeWidth={
                        3
                      }
                      dot={{
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={
                        3
                      }
                      dot={{
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ================= BOTTOM ================= */}

          <div className="grid gap-6 md:grid-cols-2">

            <ExpenseChart
              data={
                dashboard.expenseByCategory
              }
            />

            {/* ================= SAVINGS GOAL ================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Savings Goal
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your current progress
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Target
                    size={
                      25
                    }
                  />
                </div>
              </div>

              {savingsGoal ? (
                <>
                  <div className="mt-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {
                          savingsGoal.name
                        }
                      </p>

                      <p className="mt-2 text-2xl font-extrabold text-gray-900">
                        {formatCurrency(
                          savingsGoal.currentSaved
                        )}
                      </p>

                      <p className="text-sm text-gray-500">
                        of{" "}
                        {formatCurrency(
                          savingsGoal.targetAmount
                        )}
                      </p>
                    </div>

                    <p className="text-xl font-bold text-purple-600">
                      {savingsGoal.progress.toFixed(
                        0
                      )}
                      %
                    </p>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all"
                      style={{
                        width: `${savingsGoal.progress}%`,
                      }}
                    />
                  </div>

                  <div className="mt-5 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Remaining
                    </span>

                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        savingsGoal.remaining
                      )}
                    </span>
                  </div>

                  {savingsGoal.deadline && (
                    <p className="mt-3 text-xs text-gray-500">
                      Target date:{" "}
                      {new Date(
                        savingsGoal.deadline
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}

                  <Link
                    href="/savings"
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-purple-200 px-4 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                  >
                    View Goals
                    <ArrowRight
                      size={
                        16
                      }
                    />
                  </Link>
                </>
              ) : (
                <div className="mt-8 rounded-xl bg-gray-50 p-6 text-center">
                  <Target
                    className="mx-auto text-gray-300"
                    size={
                      38
                    }
                  />

                  <p className="mt-3 font-semibold text-gray-700">
                    No savings goal yet
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Create a goal to track your progress.
                  </p>

                  <Link
                    href="/savings"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Create Goal
                    <ArrowRight
                      size={
                        16
                      }
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
                    RIGHT
                ================================================= */}

        <div className="space-y-6">

          <AIInsight
            insight={
              dashboard.aiInsight
            }
          />

          <RecentTransactions
            transactions={
              dashboard.recentTransactions
            }
          />

          {/* ================= BUDGET ================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Budget Progress
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Current month
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${budget.status ===
                    "Exceeded"
                    ? "bg-red-100 text-red-700"
                    : budget.status ===
                      "Warning"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {
                  budget.status
                }
              </span>
            </div>

            <div className="mt-7 text-center">
              <p className="text-5xl font-extrabold text-purple-600">
                {budget.usedPercentage.toFixed(
                  0
                )}
                %
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Monthly Budget Used
              </p>
            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${budget.status ===
                    "Exceeded"
                    ? "bg-red-500"
                    : budget.status ===
                      "Warning"
                      ? "bg-orange-500"
                      : "bg-purple-600"
                  }`}
                style={{
                  width: `${Math.min(
                    budget.usedPercentage,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-7 space-y-4">

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Spent
                </span>

                <span className="font-bold text-gray-900">
                  {formatCurrency(
                    budget.spent
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Budget
                </span>

                <span className="font-bold text-gray-900">
                  {formatCurrency(
                    budget.total
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Remaining
                </span>

                <span
                  className={`font-bold ${budget.remaining >=
                      0
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {formatCurrency(
                    Math.abs(
                      budget.remaining
                    )
                  )}

                  {budget.remaining <
                    0 &&
                    " over"}
                </span>
              </div>
            </div>

            <Link
              href="/budget"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-purple-200 px-4 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              Manage Budget
              <ArrowRight
                size={
                  16
                }
              />
            </Link>
          </div>
        </div>
      </div>

      {/* =================================================
                REFRESH
            ================================================= */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={
            loadDashboard
          }
          className="text-sm font-medium text-gray-500 transition hover:text-purple-600"
        >
          Refresh dashboard
        </button>
      </div>
    </div>
  );
}