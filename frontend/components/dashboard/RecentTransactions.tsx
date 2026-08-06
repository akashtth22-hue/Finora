import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

const transactions = [
  {
    title: "Salary",
    date: "Today",
    amount: "+₹75,000",
    income: true,
  },
  {
    title: "Swiggy",
    date: "Today",
    amount: "-₹480",
    income: false,
  },
  {
    title: "Netflix",
    date: "Yesterday",
    amount: "-₹649",
    income: false,
  },
  {
    title: "SIP Investment",
    date: "Yesterday",
    amount: "-₹5,000",
    income: false,
  },
];

export default function RecentTransactions() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Recent Transactions
        </h2>

        <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
          View All
        </button>
      </div>

      <div className="space-y-5">

        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">

              <div
                className={`rounded-full p-3 ${
                  transaction.income
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {transaction.income ? (
                  <ArrowDownLeft className="text-green-600" size={20} />
                ) : (
                  <ArrowUpRight className="text-red-500" size={20} />
                )}
              </div>

              <div>
                <h3 className="font-semibold">
                  {transaction.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {transaction.date}
                </p>
              </div>

            </div>

            <p
              className={`font-bold ${
                transaction.income
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {transaction.amount}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}