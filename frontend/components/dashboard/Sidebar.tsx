"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  X,
  IndianRupee,
  ChevronRight,
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

type Props = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

export default function Sidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: Props) {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to logout."
        );
      }

      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="pointer-events-none fixed inset-y-0 left-0 z-[70] hidden w-20 lg:block">

        <div
          className="
            group/sidebar
            pointer-events-auto
            relative
            h-full
            w-20
            overflow-hidden
            border-r
            border-gray-200/70
            bg-white/95
            shadow-[4px_0_30px_rgba(30,20,60,0.035)]
            backdrop-blur-xl
            transition-[width,box-shadow]
            duration-300
            ease-out
            hover:w-64
            hover:shadow-[8px_0_40px_rgba(91,33,182,0.08)]
          "
        >

          {/* =================================================
              AMBIENT BACKGROUND
          ================================================= */}

          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-purple-500/[0.06] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-500/[0.035] blur-3xl" />

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="relative flex h-[88px] shrink-0 items-center border-b border-gray-200/70 px-5">

            <div className="flex min-w-[224px] items-center gap-4">

              <div className="group/logo relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.22)] transition-all duration-500 group-hover/sidebar:shadow-[0_10px_28px_rgba(124,58,237,0.30)]">

                <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/10 opacity-0 blur-md transition-opacity duration-500 group-hover/logo:opacity-100" />

                <IndianRupee
                  className="relative z-10"
                  size={21}
                  strokeWidth={2.5}
                />

              </div>

              <div
                className="
                  min-w-0
                  -translate-x-2
                  opacity-0
                  transition-all
                  duration-300
                  group-hover/sidebar:translate-x-0
                  group-hover/sidebar:opacity-100
                "
              >
                <h1 className="text-xl font-extrabold tracking-tight text-purple-600">
                  Finora
                </h1>

                <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-gray-400">
                  Smart Personal Finance
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="relative flex-1 overflow-hidden px-3 py-5">

            <div className="mb-3 px-2">

              <span
                className="
                  whitespace-nowrap
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-gray-300
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover/sidebar:opacity-100
                "
              >
                Workspace
              </span>

            </div>

            <div className="space-y-1.5">

              {menuItems.map((item) => {
                const Icon = item.icon;
                const active =
                  isActive(item.href);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`
                      group/item
                      relative
                      flex
                      h-12
                      min-w-[224px]
                      items-center
                      gap-4
                      rounded-xl
                      px-3
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-purple-50 text-purple-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >

                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-purple-600 shadow-[0_0_12px_rgba(124,58,237,0.35)]" />
                    )}

                    <div
                      className={`
                        relative
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-500 group-hover/item:bg-white group-hover/item:text-purple-600 group-hover/item:shadow-sm"
                        }
                      `}
                    >

                      <Icon
                        size={21}
                        strokeWidth={
                          active ? 2.3 : 2
                        }
                      />

                      {active && (
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-purple-400/10 blur-md" />
                      )}

                    </div>

                    <span
                      className="
                        -translate-x-2
                        whitespace-nowrap
                        text-sm
                        font-semibold
                        opacity-0
                        transition-all
                        duration-300
                        group-hover/sidebar:translate-x-0
                        group-hover/sidebar:opacity-100
                      "
                    >
                      {item.title}
                    </span>

                    <ChevronRight
                      size={15}
                      className={`
                        ml-auto
                        -translate-x-2
                        opacity-0
                        transition-all
                        duration-300
                        group-hover/sidebar:translate-x-0
                        group-hover/sidebar:opacity-100
                        ${
                          active
                            ? "text-purple-400"
                            : "text-gray-300"
                        }
                      `}
                    />

                  </Link>
                );
              })}

            </div>

          </nav>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="relative shrink-0 space-y-1.5 border-t border-gray-200/70 p-3">

            <Link
              href="/settings"
              className={`
                group/item
                relative
                flex
                h-12
                min-w-[224px]
                items-center
                gap-4
                rounded-xl
                px-3
                transition-all
                duration-300
                ${
                  isActive("/settings")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover/item:bg-white group-hover/item:shadow-sm">

                <Settings
                  size={21}
                  className="transition-transform duration-500 group-hover/item:rotate-45"
                />

              </div>

              <span
                className="
                  -translate-x-2
                  whitespace-nowrap
                  text-sm
                  font-semibold
                  opacity-0
                  transition-all
                  duration-300
                  group-hover/sidebar:translate-x-0
                  group-hover/sidebar:opacity-100
                "
              >
                Settings
              </span>

            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                group/item
                flex
                h-12
                min-w-[224px]
                w-full
                items-center
                gap-4
                rounded-xl
                px-3
                text-red-500
                transition-all
                duration-300
                hover:bg-red-50
                hover:text-red-600
              "
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover/item:bg-white group-hover/item:shadow-sm">

                <LogOut
                  size={21}
                  className="transition-transform duration-300 group-hover/item:translate-x-0.5"
                />

              </div>

              <span
                className="
                  -translate-x-2
                  whitespace-nowrap
                  text-sm
                  font-semibold
                  opacity-0
                  transition-all
                  duration-300
                  group-hover/sidebar:translate-x-0
                  group-hover/sidebar:opacity-100
                "
              >
                Logout
              </span>

            </button>

          </div>

        </div>
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          <div
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <aside className="relative flex h-full w-[285px] flex-col overflow-hidden bg-white shadow-[20px_0_60px_rgba(0,0,0,0.15)]">

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/[0.07] blur-3xl" />

            <div className="relative flex items-center justify-between border-b border-gray-200/70 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.20)]">

                  <IndianRupee
                    size={21}
                    strokeWidth={2.5}
                  />

                </div>

                <div>

                  <h1 className="text-xl font-extrabold tracking-tight text-purple-600">
                    Finora
                  </h1>

                  <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                    Smart Personal Finance
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-xl p-2 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close menu"
              >
                <X size={21} />
              </button>

            </div>

            <nav className="relative flex-1 space-y-1.5 overflow-y-auto p-4">

              <p className="mb-3 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-300">
                Workspace
              </p>

              {menuItems.map((item) => {
                const Icon = item.icon;
                const active =
                  isActive(item.href);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={`
                      relative
                      flex
                      items-center
                      gap-4
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >

                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-purple-600" />
                    )}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          active
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-500"
                        }
                      `}
                    >
                      <Icon size={20} />
                    </div>

                    {item.title}

                    {active && (
                      <ChevronRight
                        size={15}
                        className="ml-auto text-purple-400"
                      />
                    )}

                  </Link>
                );
              })}

            </nav>

            <div className="relative shrink-0 space-y-1.5 border-t border-gray-200/70 p-4">

              <Link
                href="/settings"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings size={20} />
                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>

            </div>

          </aside>
        </div>
      )}
    </>
  );
}