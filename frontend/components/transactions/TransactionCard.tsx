import {
  Utensils,
  TrendingUp,
  Car,
  ShoppingBag,
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  id: string;
  amount: number;
  category: string;
  type: string;
  description: string | null;
  date: string;
  onDelete: (id: string) => void;
  onEdit: () => void;
};

export default function TransactionCard({
  id,
  amount,
  category,
  type,
  description,
  date,
  onDelete,
  onEdit,
}: Props) {
  const getIcon = () => {
    switch (category) {
      case "Food":
        return <Utensils size={20} />;

      case "Transport":
        return <Car size={20} />;

      case "Shopping":
        return <ShoppingBag size={20} />;

      default:
        return <TrendingUp size={20} />;
    }
  };

  const isIncome = type === "INCOME";

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">

      {/* Left */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isIncome
              ? "bg-green-50 text-green-600"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {getIcon()}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
            {category}
          </h3>

          {description && (
            <p className="mt-0.5 truncate text-sm text-gray-500">
              {description}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-400">
            {date}
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center justify-between gap-4 sm:justify-end">

        <div className="text-right">
          <p
            className={`text-lg font-bold sm:text-xl ${
              isIncome
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {isIncome ? "+" : "-"}₹
            {Number(amount).toLocaleString("en-IN")}
          </p>

          <span
            className={`text-xs font-medium ${
              isIncome
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {isIncome ? "Income" : "Expense"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 border-l border-gray-100 pl-3">

          <button
            onClick={onEdit}
            className="rounded-lg p-2.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 active:scale-95"
            title="Edit transaction"
            aria-label="Edit transaction"
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onDelete(id)}
            className="rounded-lg p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
            title="Delete transaction"
            aria-label="Delete transaction"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </div>

    </div>
  );
}