import { Search } from "lucide-react";

export default function TransactionToolbar() {
  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-4">

        <div className="relative lg:col-span-2">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-purple-500"
          />

        </div>

        <select className="rounded-xl border border-gray-200 px-4">
          <option>All Categories</option>
          <option>Food</option>
          <option>Shopping</option>
          <option>Transport</option>
        </select>

        <select className="rounded-xl border border-gray-200 px-4">
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
        </select>

      </div>

    </div>
  );
}