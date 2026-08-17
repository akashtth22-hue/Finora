import Link from "next/link";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Receipt,
} from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
};

type Props = {
  transactions: Transaction[];
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentTransactions({
  transactions,
}: Props) {
  const items = Array.isArray(transactions)
    ? transactions.slice(0, 5)
    : [];

  return (
    <section className="group relative overflow-hidden rounded-[30px] border border-gray-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(30,20,60,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(30,20,60,0.08)] sm:p-7">

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-purple-500/[0.05] blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-indigo-500/[0.035] blur-3xl" />

      <div className="relative">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-purple-100">
              <Receipt size={18} />
            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Activity
              </p>

              <h2 className="truncate text-lg font-black tracking-tight text-gray-950 sm:text-xl">
                Recent Transactions
              </h2>

            </div>

          </div>

          <Link
            href="/transactions"
            className="group/link flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold text-purple-600 transition-all duration-300 hover:bg-purple-50"
          >
            View All

            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {items.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
              <Receipt size={25} />
            </div>

            <p className="mt-4 font-bold text-gray-700">
              No transactions yet
            </p>

            <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-gray-500">
              Add your first transaction
              to start tracking your
              financial activity.
            </p>

            <Link
              href="/transactions"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg"
            >
              Add Transaction

              <ArrowRight size={14} />
            </Link>

          </div>
        ) : (
          <div className="mt-6">

            {/* =================================================
                TRANSACTION LIST
            ================================================= */}

            <div className="divide-y divide-gray-100">

              {items.map((transaction) => {

                const income =
                  transaction.type ===
                  "INCOME";

                return (
                  <div
                    key={transaction.id}
                    className="group/item flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >

                    {/* =========================================
                        LEFT SIDE
                    ========================================== */}

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover/item:scale-105 ${
                          income
                            ? "bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-100"
                            : "bg-red-50 text-red-500 group-hover/item:bg-red-100"
                        }`}
                      >

                        <div
                          className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover/item:opacity-100 ${
                            income
                              ? "bg-emerald-400/20"
                              : "bg-red-400/20"
                          }`}
                        />

                        {income ? (
                          <ArrowDownLeft
                            className="relative"
                            size={19}
                            strokeWidth={2.2}
                          />
                        ) : (
                          <ArrowUpRight
                            className="relative"
                            size={19}
                            strokeWidth={2.2}
                          />
                        )}

                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {transaction.title ||
                            transaction.category}
                        </h3>

                        <div className="mt-1 flex min-w-0 items-center gap-2">

                          <span className="max-w-[100px] truncate text-[10px] font-medium uppercase tracking-wide text-gray-400">
                            {transaction.category}
                          </span>

                          <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />

                          <span className="shrink-0 text-[10px] text-gray-400">
                            {formatDate(
                              transaction.date
                            )}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =========================================
                        AMOUNT
                    ========================================== */}

                    <div className="shrink-0 text-right">

                      <p
                        className={`text-sm font-black tracking-tight ${
                          income
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {income ? "+" : "-"}
                        {formatCurrency(
                          transaction.amount
                        )}
                      </p>

                      <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-300">
                        {income
                          ? "Income"
                          : "Expense"}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* =================================================
                BOTTOM ACTION
            ================================================= */}

            <Link
              href="/transactions"
              className="group/all mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 py-3 text-xs font-bold text-gray-600 transition-all duration-300 hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600"
            >
              Manage all transactions

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/all:translate-x-1"
              />
            </Link>

          </div>
        )}

      </div>
    </section>
  );
}