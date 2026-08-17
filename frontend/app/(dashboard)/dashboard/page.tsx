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
  ShieldCheck,
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
import FinoraVoiceCheckIn from "@/components/ai/FinoraVoiceCheckIn";

/* =========================================================
   TYPES
========================================================= */

type TransactionType = "INCOME" | "EXPENSE";

type Transaction = {
  id: string;
  title: string;
  category: string;
  type: TransactionType;
  amount: number;
  date: string;
};

type ExpenseItem = {
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

type DashboardData = {
  success: boolean;

  voiceCheckIn: {
    isNewUser: boolean;
    shouldShow: boolean;
    type: "ONBOARDING" | "DAILY" | null;
    onboardingCompleted: boolean;
    todayCompleted: boolean;
  };

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

  expenseByCategory: ExpenseItem[];

  recentTransactions: Transaction[];

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
    savingsRate: number;
    biggestExpense: ExpenseItem | null;
  };
};

type ChartItem = {
  month: string;
  income: number;
  expenses: number;
};

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatCompactCurrency(value: number) {
  const amount = Number(value || 0);

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}K`;
  }

  return `₹${Math.round(amount)}`;
}

/* =========================================================
   MONTHLY CHART DATA
========================================================= */

function buildMonthlyChart(
  transactions: Transaction[]
): ChartItem[] {
  const now = new Date();

  const months: ChartItem[] = [];

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
    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const difference =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());

    if (difference < 0 || difference > 5) {
      return;
    }

    const index = 5 - difference;

    if (!months[index]) {
      return;
    }

    const amount = Number(transaction.amount || 0);

    if (transaction.type === "INCOME") {
      months[index].income += amount;
    } else {
      months[index].expenses += amount;
    }
  });

  return months;
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [
    allTransactions,
    setAllTransactions,
  ] = useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [voiceCheckInOpen, setVoiceCheckInOpen] =
    useState(false);

  const [voiceCheckInMode, setVoiceCheckInMode] =
    useState<"new" | "daily">("daily");

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  async function loadDashboard() {
    try {
      setError("");

      if (dashboard) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        "/api/dashboard",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          "Unable to load dashboard."
        );
      }

      setDashboard(result);

      /* ================================================
         VOICE AI CHECK-IN
      ================================================= */

      if (
        result.voiceCheckIn?.shouldShow === true &&
        (result.voiceCheckIn.type === "ONBOARDING" ||
          result.voiceCheckIn.type === "DAILY")
      ) {
        setVoiceCheckInMode(
          result.voiceCheckIn.type === "ONBOARDING"
            ? "new"
            : "daily"
        );

        setVoiceCheckInOpen(true);
      }

      /* ================================================
         LOAD FULL TRANSACTION HISTORY
      ================================================= */

      try {
        const transactionsResponse =
          await fetch(
            "/api/transactions",
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

        if (transactionsResponse.ok) {
          const transactionResult =
            await transactionsResponse.json();

          if (
            transactionResult.success &&
            Array.isArray(
              transactionResult.transactions
            )
          ) {
            const mapped =
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
                  category:
                    transaction.category,
                  type: transaction.type,
                  amount: Number(
                    transaction.amount || 0
                  ),
                  date: transaction.date,
                })
              );

            setAllTransactions(mapped);
          } else {
            setAllTransactions(
              result.recentTransactions || []
            );
          }
        } else {
          setAllTransactions(
            result.recentTransactions || []
          );
        }
      } catch {
        setAllTransactions(
          result.recentTransactions || []
        );
      }
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /* =======================================================
     COMPLETE VOICE CHECK-IN
  ======================================================= */

  async function handleVoiceCheckInComplete(
    answers: Record<string, string>
  ) {
    const mode =
      voiceCheckInMode === "new"
        ? "ONBOARDING"
        : "DAILY";

    try {
      const response = await fetch(
        "/api/voice-checkin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type: mode,
            answers,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to save voice check-in."
        );
      }

      /*
       * Close immediately after the server confirms
       * the check-in has been stored.
       */
      setVoiceCheckInOpen(false);

      /*
       * Refresh dashboard data so the UI reflects
       * the completed check-in and any future financial
       * processing can be reflected here.
       */
      await loadDashboard();
    } catch (error) {
      console.error(
        "Voice check-in save error:",
        error
      );

      /*
       * Keep the modal open if persistence fails.
       * This prevents losing the user's captured answers.
       */
      throw error;
    }
  }

  useEffect(() => {
    loadDashboard();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     CHART
  ======================================================= */

  const monthlyData = useMemo(
    () =>
      buildMonthlyChart(
        allTransactions
      ),
    [allTransactions]
  );

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f6fb] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">

          <div className="h-[150px] animate-pulse rounded-[24px] bg-white" />

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[118px] animate-pulse rounded-[22px] bg-white"
                />
              )
            )}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">

            <div className="h-[300px] animate-pulse rounded-[24px] bg-white lg:col-span-2" />

            <div className="h-[300px] animate-pulse rounded-[24px] bg-white" />

          </div>

        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (!dashboard || error) {
    return (
      <main className="min-h-screen bg-[#f7f6fb] px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl rounded-[30px] border border-red-100 bg-white p-8 shadow-[0_20px_60px_rgba(30,20,60,0.06)]">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldCheck size={25} />
          </div>

          <h2 className="mt-3 text-2xl font-black text-gray-950">
            Dashboard unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error ||
              "We couldn't load your financial data."}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>

      </main>
    );
  }

  const {
    summary,
    changes,
    budget,
    savingsGoal,
  } = dashboard;

  const balanceChange =
    summary.income > 0
      ? (summary.savings /
        summary.income) *
      100
      : 0;

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f6fb]">

      {/* ===================================================
          BACKGROUND
      ==================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-purple-400/[0.07] blur-[130px]" />

        <div className="absolute right-[-220px] top-[15%] h-[600px] w-[600px] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-indigo-400/[0.06] blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[35%] h-[550px] w-[550px] rounded-full bg-violet-400/[0.05] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.014]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(76,29,149,1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,29,149,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-3 py-3 sm:px-5 lg:px-7 lg:py-4">

        {/* =================================================
            HERO / WELCOME
        ================================================== */}

        <section className="relative z-10">

          <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/90 px-4 py-4 shadow-[0_18px_55px_rgba(30,20,60,0.055)] backdrop-blur-xl sm:px-5 sm:py-5 lg:px-6">

            <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-purple-500/[0.08] blur-[100px]" />

            <div className="pointer-events-none absolute bottom-[-150px] left-[30%] h-[300px] w-[300px] rounded-full bg-indigo-400/[0.04] blur-[90px]" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50/80 px-3 py-1.5">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />

                    <span className="relative h-2 w-2 rounded-full bg-purple-600" />

                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600">
                    Financial command center
                  </span>

                </div>

                <h1 className="mt-3 text-2xl font-black tracking-[-0.045em] text-gray-950 sm:text-3xl lg:text-[36px]">
                  Good morning, Akash
                  <span className="ml-2 inline-block">
                    👋
                  </span>
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                  Your money at a glance.
                  Understand where you stand,
                  what changed, and what deserves
                  your attention.
                </p>

              </div>

              <div className="flex shrink-0 items-center gap-2.5">

                <button
                  type="button"
                  className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                >

                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <CalendarDays size={16} />
                  </span>

                  <span>
                    {dashboard.month.label}
                  </span>

                  <ChevronDown
                    size={15}
                    className="text-gray-400 transition-transform duration-300 group-hover:translate-y-0.5"
                  />

                </button>

                <button
                  type="button"
                  onClick={loadDashboard}
                  disabled={refreshing}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:text-purple-600 hover:shadow-md disabled:opacity-50"
                  title="Refresh dashboard"
                >

                  <RefreshCw
                    size={17}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                </button>

              </div>

            </div>

            {/* BALANCE */}

            <div className="relative mt-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#24103f] via-[#35165e] to-[#4c1d95] p-4 text-white shadow-[0_18px_45px_rgba(76,29,149,0.16)] sm:p-5">

              <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-purple-300/10 blur-[80px]" />

              <div className="pointer-events-none absolute bottom-[-100px] left-[35%] h-60 w-60 rounded-full bg-indigo-300/10 blur-[70px]" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-200">
                      Total balance
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-100">
                      Live
                    </span>

                  </div>

                  <div className="mt-2 flex flex-wrap items-end gap-3">

                    <span className="text-3xl font-black tracking-[-0.04em] sm:text-[34px]">
                      {formatCurrency(
                        summary.totalBalance
                      )}
                    </span>

                    <span
                      className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${balanceChange >= 0
                          ? "bg-emerald-400/15 text-emerald-300"
                          : "bg-red-400/15 text-red-300"
                        }`}
                    >

                      {balanceChange >= 0 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}

                      {Math.abs(
                        balanceChange
                      ).toFixed(1)}
                      %

                    </span>

                  </div>

                  <p className="mt-1 text-[11px] text-purple-200">
                    Available financial balance
                    this month
                  </p>

                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">

                  <div className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 backdrop-blur-md">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-purple-200">
                      Income
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {formatCurrency(
                        summary.income
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 backdrop-blur-md">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-purple-200">
                      Expenses
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {formatCurrency(
                        summary.expenses
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 backdrop-blur-md">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-purple-200">
                      Savings
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {formatCurrency(
                        summary.savings
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            KPI STRIP
        ================================================== */}

        <section className="relative z-0 mt-4">

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            {/* INCOME */}

            <div
              className="relative z-0"
            >

              <StatCard
                title="Income"
                value={formatCurrency(
                  summary.income
                )}
                change={`${changes.income >= 0
                    ? "+"
                    : ""
                  }${changes.income.toFixed(
                    1
                  )}% from last month`}
                positive={
                  changes.income >= 0
                }
                icon={TrendingUp}
              />

            </div>

            {/* EXPENSES */}

            <div
              className="relative z-0"
            >

              <StatCard
                title="Expenses"
                value={formatCurrency(
                  summary.expenses
                )}
                change={`${changes.expenses >= 0
                    ? "+"
                    : ""
                  }${changes.expenses.toFixed(
                    1
                  )}% from last month`}
                positive={
                  changes.expenses <= 0
                }
                icon={TrendingDown}
              />

            </div>

            {/* SAVINGS */}

            <div
              className="relative z-0"
            >

              <StatCard
                title="Monthly Savings"
                value={formatCurrency(
                  summary.savings
                )}
                change={`${summary.savingsRate.toFixed(
                  1
                )}% savings rate`}
                positive={
                  summary.savings >= 0
                }
                icon={PiggyBank}
              />

            </div>

            {/* BUDGET */}

            <div
              className="relative z-0"
            >

              <StatCard
                title="Budget Used"
                value={`${budget.usedPercentage.toFixed(
                  0
                )}%`}
                change={`${formatCurrency(
                  Math.max(
                    budget.remaining,
                    0
                  )
                )} remaining`}
                positive={
                  budget.remaining >= 0
                }
                icon={Wallet}
              />

            </div>

          </div>

        </section>

        {/* =================================================
            CASH FLOW + AI
        ================================================== */}

        <section className="relative z-0 mt-4 grid gap-4 lg:grid-cols-3">

          {/* CASH FLOW */}

          <div className="lg:col-span-2">

            <section className="group relative h-full overflow-hidden rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(30,20,60,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_85px_rgba(30,20,60,0.10)] sm:p-5">

              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-purple-500/[0.055] blur-[90px] transition-transform duration-1000 ease-out group-hover:scale-125" />

              <div className="pointer-events-none absolute -bottom-32 left-[35%] h-72 w-72 rounded-full bg-indigo-400/[0.035] blur-[90px]" />

              <div className="relative">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100/70 text-purple-600 shadow-sm">

                      <BarChart3 size={19} />

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                        Financial movement
                      </p>

                      <h2 className="mt-0.5 text-xl font-black tracking-tight text-gray-950">
                        Cash Flow
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-400">
                        Income vs expenses over time
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center self-start rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Last 6 months
                  </div>

                </div>

                <div className="mt-6 flex flex-wrap items-center gap-5">

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                    <span className="text-xs font-semibold text-gray-500">
                      Income
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                    <span className="text-xs font-semibold text-gray-500">
                      Expenses
                    </span>

                  </div>

                </div>

                <div className="relative mt-5 h-[220px] overflow-hidden rounded-[22px] border border-gray-100/80 bg-gradient-to-b from-gray-50/70 to-white">

                  {allTransactions.length === 0 ? (

                    <div className="flex h-full items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-300 shadow-sm">

                          <BarChart3 size={28} />

                        </div>

                        <p className="mt-4 text-sm font-bold text-gray-700">
                          Your cash flow is waiting
                        </p>

                        <p className="mx-auto mt-1 max-w-[260px] text-xs leading-5 text-gray-400">
                          Add income and expenses to see how your money moves over time.
                        </p>

                        <Link
                          href="/transactions"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg"
                        >
                          Add Transaction
                          <ArrowRight size={13} />
                        </Link>

                      </div>

                    </div>

                  ) : (

                    <div className="h-full w-full px-1 pt-2">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <LineChart
                          data={monthlyData}
                          margin={{
                            top: 18,
                            right: 10,
                            left: -12,
                            bottom: 5,
                          }}
                        >

                          <CartesianGrid
                            strokeDasharray="3 7"
                            vertical={false}
                            stroke="#eeeaf4"
                          />

                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 10,
                              fill: "#9ca3af",
                              fontWeight: 600,
                            }}
                            dy={8}
                          />

                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={55}
                            tickFormatter={formatCompactCurrency}
                            tick={{
                              fontSize: 9,
                              fill: "#9ca3af",
                              fontWeight: 500,
                            }}
                          />

                          <Tooltip
                            cursor={{
                              stroke: "#c4b5fd",
                              strokeWidth: 1,
                              strokeDasharray: "4 4",
                            }}
                            contentStyle={{
                              borderRadius: "16px",
                              border: "1px solid #ece9f3",
                              background:
                                "rgba(255,255,255,0.97)",
                              boxShadow:
                                "0 20px 50px rgba(17,24,39,0.12)",
                              padding: "10px 13px",
                            }}
                            formatter={(value, name) => [
                              formatCurrency(
                                Number(value ?? 0)
                              ),
                              name === "income"
                                ? "Income"
                                : "Expenses",
                            ]}
                          />

                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{
                              r: 6,
                              stroke: "#ffffff",
                              strokeWidth: 3,
                              fill: "#10b981",
                            }}
                            animationBegin={150}
                            animationDuration={1400}
                            animationEasing="ease-out"
                          />

                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{
                              r: 6,
                              stroke: "#ffffff",
                              strokeWidth: 3,
                              fill: "#ef4444",
                            }}
                            animationBegin={300}
                            animationDuration={1400}
                            animationEasing="ease-out"
                          />

                        </LineChart>

                      </ResponsiveContainer>

                    </div>

                  )}

                </div>

              </div>

            </section>

          </div>

          {/* AI */}

          <div>

            <AIInsight
              insight={
                dashboard.aiInsight
              }
            />

          </div>

        </section>

        {/* =================================================
            EXPENSE + SAVINGS
        ================================================== */}

        <section className="relative z-0 mt-4 grid gap-4 lg:grid-cols-2">

          <div>

            <ExpenseChart
              data={
                dashboard.expenseByCategory
              }
            />

          </div>

          {/* SAVINGS */}

          <section className="group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(30,20,60,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(30,20,60,0.08)] sm:p-5">

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/[0.05] blur-3xl transition-transform duration-700 group-hover:scale-125" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    Long-term planning
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                    Savings Goal
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Build toward what matters.
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Target size={20} />
                </div>

              </div>

              {savingsGoal ? (
                <>

                  <div className="mt-6 flex items-end justify-between gap-5">

                    <div>

                      <p className="text-sm font-bold text-gray-500">
                        {savingsGoal.name}
                      </p>

                      <p className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                        {formatCurrency(
                          savingsGoal.currentSaved
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        of{" "}
                        {formatCurrency(
                          savingsGoal.targetAmount
                        )}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-3xl font-black text-purple-600">
                        {savingsGoal.progress.toFixed(
                          0
                        )}
                        %
                      </p>

                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        complete
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 transition-all duration-1000"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            savingsGoal.progress,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="mt-5 flex items-center justify-between">

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Remaining
                      </p>

                      <p className="mt-1 text-sm font-black text-gray-900">
                        {formatCurrency(
                          savingsGoal.remaining
                        )}
                      </p>

                    </div>

                    {savingsGoal.deadline && (
                      <div className="text-right">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          Deadline
                        </p>

                        <p className="mt-1 text-sm font-black text-gray-900">
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
                    className="group/action mt-7 flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/60 py-3 text-xs font-bold text-purple-600 transition-all duration-300 hover:bg-purple-100"
                  >
                    View savings goals

                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/action:translate-x-1"
                    />

                  </Link>

                </>
              ) : (

                <div className="mt-6 rounded-2xl bg-gray-50 p-8 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
                    <Target size={26} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-gray-700">
                    No savings goal yet
                  </p>

                  <p className="mx-auto mt-1 max-w-[260px] text-xs leading-5 text-gray-500">
                    Create a goal and Finora
                    will help you track your
                    progress.
                  </p>

                  <Link
                    href="/savings"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg"
                  >
                    Create Goal
                    <ArrowRight size={14} />
                  </Link>

                </div>

              )}

            </div>

          </section>

        </section>

        {/* =================================================
            RECENT TRANSACTIONS
        ================================================== */}

        <section className="relative z-0 mt-4">

          <RecentTransactions
            transactions={
              dashboard.recentTransactions
            }
          />

        </section>

        {/* =================================================
            BUDGET
        ================================================== */}

        <section className="relative z-0 mt-4">

          <div className="group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(30,20,60,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(30,20,60,0.08)] sm:p-5">

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-500/[0.04] blur-3xl transition-transform duration-700 group-hover:scale-125" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">

              <div className="flex-1">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                    <Wallet size={19} />
                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                      Spending control
                    </p>

                    <h2 className="text-xl font-black text-gray-950">
                      Monthly Budget
                    </h2>

                  </div>

                </div>

                <div className="mt-5 flex items-end gap-4">

                  <span className="text-3xl font-black tracking-tight text-gray-950">
                    {formatCurrency(
                      budget.spent
                    )}
                  </span>

                  <span className="mb-1 text-sm text-gray-400">
                    /{" "}
                    {formatCurrency(
                      budget.total
                    )}
                  </span>

                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${budget.status ===
                        "Exceeded"
                        ? "bg-red-500"
                        : budget.status ===
                          "Warning"
                          ? "bg-orange-500"
                          : "bg-gradient-to-r from-purple-600 to-violet-500"
                      }`}
                    style={{
                      width: `${Math.min(
                        Math.max(
                          budget.usedPercentage,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

                <div className="mt-3 flex justify-between text-[10px] font-semibold text-gray-400">

                  <span>
                    {budget.usedPercentage.toFixed(
                      0
                    )}
                    % used
                  </span>

                  <span>
                    {budget.remaining >= 0
                      ? `${formatCurrency(
                        budget.remaining
                      )} remaining`
                      : `${formatCurrency(
                        Math.abs(
                          budget.remaining
                        )
                      )} over budget`}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 lg:min-w-[290px]">

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${budget.status ===
                      "Exceeded"
                      ? "bg-red-100 text-red-600"
                      : budget.status ===
                        "Warning"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                >
                  <ShieldCheck size={24} />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                    Budget health
                  </p>

                  <p
                    className={`mt-1 text-lg font-black ${budget.status ===
                        "Exceeded"
                        ? "text-red-600"
                        : budget.status ===
                          "Warning"
                          ? "text-orange-600"
                          : "text-emerald-600"
                      }`}
                  >
                    {budget.status}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Finora is monitoring
                    your spending.
                  </p>

                </div>

              </div>

              <Link
                href="/budget"
                className="group/budget flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg"
              >
                Manage Budget

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/budget:translate-x-1"
                />

              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            FOOTER STATUS
        ================================================== */}

        <div className="mt-4 flex flex-col gap-3 px-2 pb-4 text-[10px] font-medium text-gray-400 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />

            </span>

            Finora is synced with your latest
            financial data.

          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={refreshing}
            className="flex items-center gap-1.5 transition-colors hover:text-purple-600 disabled:opacity-50"
          >

            <RefreshCw
              size={12}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Updating..."
              : "Refresh data"}

          </button>

        </div>

      </div>

      {/* =================================================
          FINORA VOICE CHECK-IN
      ================================================== */}

      {voiceCheckInOpen && (
        <FinoraVoiceCheckIn
          mode={voiceCheckInMode}
          open={voiceCheckInOpen}
          onClose={() =>
            setVoiceCheckInOpen(false)
          }
          onComplete={
            handleVoiceCheckInComplete
          }
        />
      )}

    </main>
  );
}