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
  Sparkles,
  RefreshCw,
  Activity,
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

type TransactionType = "INCOME" | "EXPENSE";

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
    status: "Healthy" | "Warning" | "Exceeded";
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

function formatCurrency(value: number): string {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatShortCurrency(value: number): string {
  const amount = Number(value || 0);

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}K`;
  }

  return `₹${Math.round(amount)}`;
}

/* =====================================================
   MONTHLY CHART
===================================================== */

function buildMonthlyChart(
  transactions: DashboardTransaction[]
): MonthlyChartItem[] {
  const now = new Date();

  const months: MonthlyChartItem[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      month: date.toLocaleDateString("en-IN", {
        month: "short",
      }),
      income: 0,
      expenses: 0,
    });
  }

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);

    const monthDifference =
      (now.getFullYear() -
        transactionDate.getFullYear()) *
        12 +
      (now.getMonth() -
        transactionDate.getMonth());

    if (monthDifference < 0 || monthDifference > 5) {
      return;
    }

    const index = 5 - monthDifference;

    const amount = Number(transaction.amount || 0);

    if (transaction.type === "INCOME") {
      months[index].income += amount;
    } else {
      months[index].expenses += amount;
    }
  });

  return months;
}

/* =====================================================
   PAGE
===================================================== */

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [allTransactions, setAllTransactions] =
    useState<DashboardTransaction[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  /* =====================================================
     LOAD DASHBOARD
  ====================================================== */

  async function loadDashboard() {
    try {
      if (dashboard) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result =
        (await response.json()) as DashboardResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          "message" in result &&
            typeof (
              result as {
                message?: unknown;
              }
            ).message === "string"
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
          await fetch("/api/transactions", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          });

        if (transactionResponse.ok) {
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
                (transaction: {
                  id: string;
                  description?: string | null;
                  category: string;
                  type: TransactionType;
                  amount: number | string;
                  date: string;
                }) => ({
                  id: transaction.id,
                  title:
                    transaction.description ||
                    transaction.category,
                  category: transaction.category,
                  type: transaction.type,
                  amount: Number(
                    transaction.amount
                  ),
                  date: transaction.date,
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

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to load dashboard."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const monthlyData = useMemo(
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
      <div className="relative min-h-screen overflow-hidden bg-[#f8f7fb] p-4 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-300/10 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="relative space-y-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white/80" />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-[24px] border border-gray-200 bg-white"
                />
              )
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-[430px] animate-pulse rounded-[28px] bg-gray-200 lg:col-span-2" />

            <div className="h-[430px] animate-pulse rounded-[28px] bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ====================================================== */

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-[#f8f7fb] p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-200 bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Activity size={22} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error ||
              "Dashboard data is unavailable."}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700"
          >
            <RefreshCw size={16} />
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
    <div className="relative min-h-screen overflow-hidden bg-[#f8f7fb] p-4 sm:p-6 lg:p-8">

      {/* =================================================
          AMBIENT DASHBOARD BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/[0.08] blur-[120px]" />

        <div className="absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-300/[0.07] blur-[120px]" />

        <div className="absolute bottom-[-220px] left-[30%] h-[500px] w-[500px] rounded-full bg-violet-300/[0.06] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(76,29,149,1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,29,149,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_15px_50px_rgba(17,24,39,0.05)] backdrop-blur-xl sm:p-8">

          <div className="absolute right-[-100px] top-[-130px] h-72 w-72 rounded-full bg-purple-500/[0.07] blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Sparkles size={14} />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600">
                  Financial overview
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-[-0.035em] text-gray-950 sm:text-4xl">
                Good morning, Akash! 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Here's what's happening with
                your finances today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm">
                <CalendarDays
                  size={17}
                  className="text-purple-500"
                />

                <span>
                  {dashboard.month.label}
                </span>

                <ChevronDown
                  size={15}
                  className="text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={loadDashboard}
                disabled={refreshing}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:text-purple-600 disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="mt-6">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                At a glance
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Your financial snapshot
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <StatCard
                title="Total Balance"
                value={formatCurrency(
                  summary.totalBalance
                )}
                change={`${changes.savings >= 0 ? "+" : ""}${changes.savings.toFixed(
                  1
                )}% savings change`}
                positive={
                  changes.savings >= 0
                }
                icon={Wallet}
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <StatCard
                title="Income"
                value={formatCurrency(
                  summary.income
                )}
                change={`${changes.income >= 0 ? "+" : ""}${changes.income.toFixed(
                  1
                )}% from last month`}
                positive={
                  changes.income >= 0
                }
                icon={TrendingUp}
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <StatCard
                title="Expenses"
                value={formatCurrency(
                  summary.expenses
                )}
                change={`${changes.expenses >= 0 ? "+" : ""}${changes.expenses.toFixed(
                  1
                )}% from last month`}
                positive={
                  changes.expenses <= 0
                }
                icon={TrendingDown}
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <StatCard
                title="Savings Rate"
                value={`${summary.savingsRate.toFixed(
                  1
                )}%`}
                change={`${formatCurrency(
                  summary.savings
                )} saved this month`}
                positive={
                  summary.savings >= 0
                }
                icon={PiggyBank}
              />
            </div>

          </div>
        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* ================= TREND ================= */}

            <section className="group relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white p-5 shadow-[0_15px_50px_rgba(17,24,39,0.05)] transition-all duration-500 hover:shadow-[0_25px_70px_rgba(17,24,39,0.08)] sm:p-6">

              <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-purple-500/[0.04] blur-3xl transition-transform duration-700 group-hover:scale-125" />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <BarChart3 size={17} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Cash flow
                      </p>

                      <h2 className="text-xl font-black text-gray-900">
                        Income vs Expenses
                      </h2>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-5 text-xs text-gray-500">

                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      Income
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                      Expenses
                    </span>

                  </div>
                </div>

                <span className="w-fit rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                  Last 6 months
                </span>
              </div>

              <div className="relative mt-6 h-[300px]">

                {allTransactions.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl bg-gray-50/80 text-center">

                    <div>
                      <BarChart3
                        className="mx-auto text-gray-300"
                        size={40}
                      />

                      <p className="mt-3 text-sm font-medium text-gray-500">
                        Add transactions to
                        see your trend.
                      </p>
                    </div>

                  </div>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={monthlyData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f1f4"
                      />

                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 12,
                          fill: "#9ca3af",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tickFormatter={
                          formatShortCurrency
                        }
                        tick={{
                          fontSize: 11,
                          fill: "#9ca3af",
                        }}
                        axisLine={false}
                        tickLine={false}
                        width={55}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "14px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(17,24,39,0.08)",
                        }}
                        formatter={(value) =>
                          formatCurrency(
                            Number(
                              value ?? 0
                            )
                          )
                        }
                      />

                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{
                          r: 3,
                          fill: "#22c55e",
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{
                          r: 3,
                          fill: "#ef4444",
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

              </div>
            </section>

            {/* ================= LOWER GRID ================= */}

            <div className="grid gap-6 md:grid-cols-2">

              <div className="transition-transform duration-500 hover:-translate-y-1">
                <ExpenseChart
                  data={
                    dashboard.expenseByCategory
                  }
                />
              </div>

              {/* ================= SAVINGS GOAL ================= */}

              <section className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(17,24,39,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(17,24,39,0.08)]">

                <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-purple-500/[0.06] blur-3xl" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Planning
                      </p>

                      <h2 className="mt-1 text-xl font-black text-gray-900">
                        Savings Goal
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Your current progress
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                      <Target size={23} />
                    </div>

                  </div>

                  {savingsGoal ? (
                    <>
                      <div className="mt-8 flex items-end justify-between gap-4">

                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {savingsGoal.name}
                          </p>

                          <p className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                            {formatCurrency(
                              savingsGoal.currentSaved
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            of{" "}
                            {formatCurrency(
                              savingsGoal.targetAmount
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-purple-600">
                            {savingsGoal.progress.toFixed(
                              0
                            )}
                            %
                          </p>

                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Complete
                          </p>
                        </div>

                      </div>

                      <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              savingsGoal.progress,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                      <div className="mt-5 flex justify-between">

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Remaining
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {formatCurrency(
                              savingsGoal.remaining
                            )}
                          </p>
                        </div>

                        {savingsGoal.deadline && (
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Target date
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-900">
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
                          </div>
                        )}

                      </div>

                      <Link
                        href="/savings"
                        className="group mt-6 flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold text-purple-600 transition-all duration-300 hover:bg-purple-100"
                      >
                        View Goals

                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </>
                  ) : (
                    <div className="mt-8 rounded-2xl bg-gray-50 p-7 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
                        <Target size={28} />
                      </div>

                      <p className="mt-4 font-bold text-gray-700">
                        No savings goal yet
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Create a goal to track
                        your progress.
                      </p>

                      <Link
                        href="/savings"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700"
                      >
                        Create Goal
                        <ArrowRight size={16} />
                      </Link>

                    </div>
                  )}

                </div>
              </section>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-6">

            {/* ================= AI ================= */}

            <div className="transition-transform duration-500 hover:-translate-y-1">
              <AIInsight
                insight={
                  dashboard.aiInsight
                }
              />
            </div>

            {/* ================= RECENT ================= */}

            <div className="transition-transform duration-500 hover:-translate-y-1">
              <RecentTransactions
                transactions={
                  dashboard.recentTransactions
                }
              />
            </div>

            {/* ================= BUDGET ================= */}

            <section className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(17,24,39,0.05)] transition-all duration-500 hover:-translate-y-1">

              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/[0.05] blur-3xl" />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Spending control
                    </p>

                    <h2 className="mt-1 text-xl font-black text-gray-900">
                      Budget Progress
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Current month
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      budget.status ===
                      "Exceeded"
                        ? "bg-red-100 text-red-700"
                        : budget.status ===
                          "Warning"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {budget.status}
                  </span>

                </div>

                <div className="mt-8 text-center">

                  <div className="relative mx-auto flex h-32 w-32 items-center justify-center">

                    <div className="absolute inset-0 rounded-full border-[10px] border-gray-100" />

                    <div
                      className={`absolute inset-0 rounded-full border-[10px] border-transparent ${
                        budget.status ===
                        "Exceeded"
                          ? "border-t-red-500"
                          : budget.status ===
                            "Warning"
                          ? "border-t-orange-500"
                          : "border-t-purple-600"
                      }`}
                      style={{
                        transform: `rotate(${Math.min(
                          budget.usedPercentage,
                          100
                        ) * 3.6}deg)`,
                      }}
                    />

                    <div>
                      <p className="text-3xl font-black text-gray-950">
                        {budget.usedPercentage.toFixed(
                          0
                        )}
                        %
                      </p>

                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Used
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-8 h-2.5 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      budget.status ===
                      "Exceeded"
                        ? "bg-red-500"
                        : budget.status ===
                          "Warning"
                        ? "bg-orange-500"
                        : "bg-gradient-to-r from-purple-600 to-violet-500"
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

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Spent
                    </span>

                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        budget.spent
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Budget
                    </span>

                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        budget.total
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-medium text-gray-500">
                      Remaining
                    </span>

                    <span
                      className={`font-black ${
                        budget.remaining >=
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
                  className="group mt-6 flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold text-purple-600 transition-all duration-300 hover:bg-purple-100"
                >
                  Manage Budget

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

              </div>
            </section>
          </div>
        </div>

        {/* =================================================
            BOTTOM STATUS
        ================================================= */}

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white/60 px-5 py-4 text-xs text-gray-400 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-green-500" />
            </span>

            Dashboard synced with your latest financial data.
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={refreshing}
            className="w-fit font-semibold text-gray-500 transition hover:text-purple-600 disabled:opacity-50"
          >
            {refreshing
              ? "Updating..."
              : "Refresh data"}
          </button>
        </div>

      </div>
    </div>
  );
}