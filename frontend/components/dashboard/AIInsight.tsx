import { Bot, Sparkles } from "lucide-react";

export default function AIInsight() {
  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-8 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8" />

          <div>
            <h2 className="text-2xl font-bold">
              Finora AI
            </h2>

            <p className="text-purple-100">
              Smart Financial Recommendation
            </p>
          </div>
        </div>

        <Sparkles className="h-7 w-7" />
      </div>

      <p className="mt-8 text-lg leading-8">
        You're saving consistently this month.
        Based on your spending habits,
        you can safely invest
        <span className="font-bold"> ₹8,000 </span>
        without affecting your emergency fund.
      </p>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span>AI Confidence</span>
          <span>94%</span>
        </div>

        <div className="h-2 rounded-full bg-white/20">
          <div className="h-2 w-[94%] rounded-full bg-white"></div>
        </div>
      </div>
    </div>
  );
}