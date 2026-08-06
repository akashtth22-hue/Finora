"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Budget",
    href: "/budget",
    icon: Wallet,
  },
  {
    title: "Savings",
    href: "/savings",
    icon: PiggyBank,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Advisor",
    href: "/ai",
    icon: Bot,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white">

      <div className="border-b p-8">
        <h1 className="text-3xl font-extrabold text-purple-600">
          Finora
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Smart Personal Finance
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-4 rounded-xl px-4 py-3 text-gray-700 transition-all hover:bg-purple-50 hover:text-purple-600"
            >
              <Icon size={22} />

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}

      </nav>

      <div className="space-y-2 border-t p-4">

        <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100">
          <Settings size={22} />

          Settings
        </button>

        <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50">
          <LogOut size={22} />

          Logout
        </button>

      </div>

    </aside>
  );
}