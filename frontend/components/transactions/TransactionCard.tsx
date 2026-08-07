import {
  Utensils,
  TrendingUp,
  Car,
  ShoppingBag,
  MoreVertical,
} from "lucide-react";

type Props = {
  amount: number;
  category: string;
  type: string;
  description: string | null;
  date: string;
};

export default function TransactionCard({
  amount,
  category,
  type,
  description,
  date,
}: Props) {
  const getIcon = () => {
    switch (category) {
      case "Food":
        return <Utensils size={22} />;
      case "Transport":
        return <Car size={22} />;
      case "Shopping":
        return <ShoppingBag size={22} />;
      default:
        return <TrendingUp size={22} />;
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
          {getIcon()}
        </div>

        <div>

          <h3 className="font-semibold text-lg">
            {category}
          </h3>

          <p className="text-sm text-gray-500">
            {description}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {date}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-6">

        <p
          className={`text-xl font-bold ${
            type === "INCOME"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {type === "INCOME" ? "+" : "-"}₹{amount}
        </p>

        <button>
          <MoreVertical className="text-gray-500" />
        </button>

      </div>

    </div>
  );
}