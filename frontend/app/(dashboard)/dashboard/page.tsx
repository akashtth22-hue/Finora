import StatCard from "@/components/dashboard/StatCard";
import AIInsight from "@/components/dashboard/AIInsight";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseChart from "@/components/dashboard/ExpenseChart";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

export default function DashboardPage() {
  return (

    <div className="p-8">

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Balance"
          value="₹2,45,000"
          change="+12.5% this month"
          positive={true}
          icon={Wallet}
        />

        <StatCard
          title="Income"
          value="₹75,000"
          change="+5.2%"
          positive={true}
          icon={TrendingUp}
        />

        <StatCard
          title="Expenses"
          value="₹38,200"
          change="-2.8%"
          positive={false}
          icon={TrendingDown}
        />

        <StatCard
          title="Savings"
          value="₹36,800"
          change="+18%"
          positive={true}
          icon={PiggyBank}
        />

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <AIInsight />
        </div>

        <RecentTransactions />

      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Budget Progress
            </h2>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Healthy
            </span>
          </div>

          <div className="mt-8 text-center">

            <p className="text-6xl font-extrabold text-purple-600">
              72%
            </p>

            <p className="mt-2 text-gray-500">
              Monthly Budget Used
            </p>

          </div>

          <div className="mt-8 h-3 rounded-full bg-gray-200">
            <div className="h-3 w-[72%] rounded-full bg-gradient-to-r from-purple-600 to-violet-500"></div>
          </div>

          <div className="mt-8 space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Spent
              </span>

              <span className="font-bold">
                ₹36,000
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Budget
              </span>

              <span className="font-bold">
                ₹50,000
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Remaining
              </span>

              <span className="font-bold text-green-600">
                ₹14,000
              </span>
            </div>

          </div>

        </div>
      </div>

    </div>

  );
}