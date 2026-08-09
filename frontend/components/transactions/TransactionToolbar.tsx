import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  type: string;
  setType: (value: string) => void;
};

export default function TransactionToolbar({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
}: Props) {
  return (
  <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr_1fr]">

    {/* Search */}
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
      />
    </div>

    {/* Category */}
    <div className="relative">
      <SlidersHorizontal
        size={17}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
      >
        <option value="All">All Categories</option>
        <option value="Food">Food</option>
        <option value="Shopping">Shopping</option>
        <option value="Transport">Transport</option>
        <option value="Salary">Salary</option>
        <option value="Bills">Bills</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Entertainment">Entertainment</option>
      </select>
    </div>

    {/* Type */}
    <div className="relative">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-4 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
      >
        <option value="All">All Types</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>
    </div>

  </div>
);
}