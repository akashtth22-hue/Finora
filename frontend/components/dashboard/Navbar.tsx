"use client";

import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's your financial overview today.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-purple-500"
          />

        </div>

        {/* Notification */}
        <button className="relative rounded-xl border border-gray-200 p-3 hover:bg-gray-50">

          <Bell size={22} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
            A
          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              Akash
            </h3>

            <p className="text-sm text-gray-500">
              Premium User
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}