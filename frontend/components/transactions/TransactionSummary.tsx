import {
  ArrowUpCircle,
  ArrowDownCircle,
  WalletCards,
} from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  type: string;
};

export default function TransactionSummary({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-5 md:grid-cols-3">

      {/* Income */}
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Income
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>

            <p className="mt-2 text-xs font-medium text-green-600">
              Money coming in
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
            <ArrowUpCircle
              size={24}
              className="text-green-600"
            />
          </div>
        </div>
      </div>

      {/* Expenses */}
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Expenses
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
              ₹{totalExpenses.toLocaleString("en-IN")}
            </h2>

            <p className="mt-2 text-xs font-medium text-red-500">
              Money going out
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <ArrowDownCircle
              size={24}
              className="text-red-500"
            />
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Current Balance
            </p>

            <h2
              className={`mt-3 text-2xl font-bold tracking-tight ${
                balance >= 0
                  ? "text-gray-900"
                  : "text-red-500"
              }`}
            >
              ₹{balance.toLocaleString("en-IN")}
            </h2>

            <p
              className={`mt-2 text-xs font-medium ${
                balance >= 0
                  ? "text-purple-600"
                  : "text-red-500"
              }`}
            >
              {balance >= 0
                ? "You're in positive territory"
                : "Expenses exceed income"}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
            <WalletCards
              size={24}
              className="text-purple-600"
            />
          </div>
        </div>
      </div>

    </div>
  );
}