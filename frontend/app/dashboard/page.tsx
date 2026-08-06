import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import StatCard from "@/components/dashboard/StatCard";
import AIInsight from "@/components/dashboard/AIInsight";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">

        <Navbar />

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
          
          <div className="mt-8">
            <AIInsight />
          </div>

        </div>

      </main>

    </div>
  );
}