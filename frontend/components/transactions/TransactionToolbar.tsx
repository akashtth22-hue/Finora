import { Search } from "lucide-react";

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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border border-gray-200 px-4"
                >
                    <option value="All">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transport">Transport</option>
                    <option value="Salary">Salary</option>
                </select>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="rounded-xl border border-gray-200 px-4"
                >
                    <option value="All">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>

            </div>

        </div>
    );
}