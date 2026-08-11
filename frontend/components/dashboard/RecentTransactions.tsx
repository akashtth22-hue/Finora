import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
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
  return new Date(
    dateString
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentTransactions({
  transactions,
}: Props) {
  const items = transactions.slice(
    0,
    5
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">
          Recent Transactions
        </h2>

        <Link
          href="/transactions"
          className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
        >
          View All
          <ArrowRight size={15} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-5 py-10 text-center">
          <p className="font-semibold text-gray-700">
            No transactions yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add your first transaction to see it here.
          </p>

          <Link
            href="/transactions"
            className="mt-4 inline-block rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Add Transaction
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map(
            (transaction) => {
              const income =
                transaction.type ===
                "INCOME";

              return (
                <div
                  key={
                    transaction.id
                  }
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        income
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {income ? (
                        <ArrowDownLeft
                          size={20}
                        />
                      ) : (
                        <ArrowUpRight
                          size={20}
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {
                          transaction.title
                        }
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatDate(
                          transaction.date
                        )}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-bold ${
                      income
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {income
                      ? "+"
                      : "-"}
                    {formatCurrency(
                      transaction.amount
                    )}
                  </p>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}