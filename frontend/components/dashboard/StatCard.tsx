import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 truncate text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <Icon
            size={24}
            strokeWidth={2}
          />
        </div>
      </div>

      <p
        className={`mt-5 text-sm font-semibold ${
          positive
            ? "text-green-600"
            : "text-red-500"
        }`}
      >
        {change}
      </p>
    </div>
  );
}