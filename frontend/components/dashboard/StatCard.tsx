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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-purple-100 p-3">
          <Icon className="h-7 w-7 text-purple-600" />
        </div>

      </div>

      <p
        className={`mt-5 text-sm font-semibold ${
          positive ? "text-green-600" : "text-red-500"
        }`}
      >
        {change}
      </p>

    </div>
  );
}