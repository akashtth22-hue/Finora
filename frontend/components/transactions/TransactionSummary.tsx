import {
  ArrowUpCircle,
  ArrowDownCircle,
  Receipt,
} from "lucide-react";

export default function TransactionSummary() {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Total Income
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ₹75,000
            </h2>
          </div>

          <ArrowUpCircle
            size={38}
            className="text-green-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-500">
              ₹38,200
            </h2>
          </div>

          <ArrowDownCircle
            size={38}
            className="text-red-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Transactions
            </p>

            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              124
            </h2>
          </div>

          <Receipt
            size={38}
            className="text-purple-600"
          />
        </div>
      </div>

    </div>
  );
}