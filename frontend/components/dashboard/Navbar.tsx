"use client";

import { Bell, Menu } from "lucide-react";

type Props = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

export default function Navbar({
  setMobileMenuOpen,
}: Props) {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Welcome */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-gray-900 sm:text-2xl">
            Welcome Back 👋
          </h1>

          <p className="mt-1 hidden text-sm text-gray-500 sm:block">
            Here's your financial overview today.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}

          {/* Notification */}
          <button
            className="relative rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50 sm:p-3"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
              A
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Akash
              </h3>

              <p className="text-xs text-gray-500">
                Premium User
              </p>
            </div>
          </div>

          {/* Mobile Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white sm:hidden">
            A
          </div>

        </div>
      </div>
    </header>
  );
}