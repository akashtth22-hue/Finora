import {
  Bot,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type AIInsightData = {
  text: string;
  savingsRate: number;
  biggestExpense?: {
    name: string;
    value: number;
    percentage: number;
  } | null;
};

type Props = {
  insight: AIInsightData;
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function AIInsight({
  insight,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-600 to-violet-700 p-6 text-white shadow-lg sm:p-7">

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Bot size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Finora AI
            </h2>

            <p className="mt-0.5 text-sm text-purple-100">
              Smart Financial Recommendation
            </p>
          </div>
        </div>

        <Sparkles
          size={25}
          className="shrink-0"
        />
      </div>

      <div className="mt-7 rounded-xl bg-white/10 p-5">
        <p className="text-base leading-7 text-white sm:text-lg">
          {insight.text}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">

        <div className="rounded-xl border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-2 text-purple-100">
            <TrendingUp size={16} />

            <span className="text-xs font-medium">
              Savings Rate
            </span>
          </div>

          <p className="mt-2 text-xl font-bold">
            {Number(
              insight.savingsRate || 0
            ).toFixed(1)}
            %
          </p>
        </div>

        {insight.biggestExpense ? (
          <div className="rounded-xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-purple-100">
              Largest Expense
            </p>

            <p className="mt-2 truncate font-bold">
              {insight.biggestExpense.name}
            </p>

            <p className="mt-1 text-sm text-purple-100">
              {formatCurrency(
                insight.biggestExpense.value
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium text-purple-100">
              Financial Activity
            </p>

            <p className="mt-2 font-bold">
              Add transactions
            </p>

            <p className="mt-1 text-sm text-purple-100">
              to unlock deeper insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}