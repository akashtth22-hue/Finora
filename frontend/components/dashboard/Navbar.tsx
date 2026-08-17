"use client";

import Link from "next/link";
import {
  Bell,
  Menu,
  CheckCheck,
  AlertCircle,
  X,
  ChevronDown,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type:
    | "BUDGET_WARNING"
    | "BUDGET_EXCEEDED"
    | "SAVINGS_PROGRESS"
    | "SAVINGS_DEADLINE";
  isRead: boolean;
  createdAt: string;
};

type NotificationResponse = {
  success: boolean;
  notifications: Notification[];
};

export default function Navbar({
  setMobileMenuOpen,
}: Props) {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const notificationRef =
    useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      setIsLoading(true);

      const response = await fetch(
        "/api/notifications",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: NotificationResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          "Unable to load notifications."
        );
      }

      setNotifications(
        result.notifications || []
      );
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  function getNotificationIcon(
    type: Notification["type"]
  ) {
    switch (type) {
      case "BUDGET_EXCEEDED":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertCircle size={18} />
          </div>
        );

      case "BUDGET_WARNING":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <AlertCircle size={18} />
          </div>
        );

      case "SAVINGS_PROGRESS":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCheck size={18} />
          </div>
        );

      case "SAVINGS_DEADLINE":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Bell size={18} />
          </div>
        );

      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Bell size={18} />
          </div>
        );
    }
  }

  function formatDate(
    dateString: string
  ) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    const now = new Date();

    const difference =
      now.getTime() -
      date.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  }

  return (
    <header className="relative z-50 isolate w-full border-b border-gray-200/70 bg-white/90 shadow-[0_4px_30px_rgba(30,20,60,0.035)] backdrop-blur-xl">

      {/* =====================================================
          TOP ACCENT
      ====================================================== */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />

      <div className="flex min-h-[78px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex min-w-0 items-center gap-4">

          {/* Mobile menu */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[20px] font-black tracking-[-0.025em] text-gray-950 sm:text-[22px]">
                Welcome back, Akash
              </h1>

              <span className="hidden h-1.5 w-1.5 rounded-full bg-purple-500 sm:block" />

            </div>

            <p className="mt-1 hidden text-xs text-gray-400 sm:block">
              Here's your financial overview for today.
            </p>

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* =================================================
              AI STATUS
          ================================================= */}

          <div className="hidden items-center gap-2 rounded-xl border border-purple-100 bg-purple-50/70 px-3 py-2 md:flex">

            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
              <Sparkles size={13} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-purple-600">
              AI Active
            </span>

            <span className="relative ml-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (value) => !value
                )
              }
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                isOpen
                  ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-sm"
              }`}
              aria-label="Notifications"
              aria-expanded={isOpen}
            >

              <Bell
                size={20}
                strokeWidth={1.8}
              />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}

            </button>

            {/* =================================================
                NOTIFICATION PANEL
            ================================================= */}

            {isOpen && (
              <div className="absolute right-0 top-[60px] z-[100] w-[calc(100vw-32px)] max-w-[400px] overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.15)] sm:w-[400px]">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-sm font-black text-gray-950">
                        Notifications
                      </h2>

                      {unreadCount > 0 && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-bold text-purple-600">
                          {unreadCount} new
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Stay on top of your finances.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-700"
                    aria-label="Close notifications"
                  >
                    <X size={17} />
                  </button>

                </div>

                {/* Notification body */}

                <div className="max-h-[420px] overflow-y-auto">

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12">

                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />

                      <p className="mt-4 text-sm text-gray-500">
                        Checking your finances...
                      </p>

                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-5 py-12 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <Bell size={21} />
                      </div>

                      <h3 className="mt-4 text-sm font-bold text-gray-900">
                        You're all caught up
                      </h3>

                      <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-gray-500">
                        No important financial alerts right now.
                      </p>

                    </div>
                  ) : (
                    <div>

                      {notifications.map(
                        (notification) => (
                          <div
                            key={
                              notification.id
                            }
                            className={`border-b border-gray-100 px-5 py-4 transition-colors hover:bg-gray-50 ${
                              !notification.isRead
                                ? "bg-purple-50/40"
                                : ""
                            }`}
                          >

                            <div className="flex gap-3">

                              {getNotificationIcon(
                                notification.type
                              )}

                              <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-3">

                                  <h3 className="text-sm font-semibold text-gray-900">
                                    {
                                      notification.title
                                    }
                                  </h3>

                                  {!notification.isRead && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-600" />
                                  )}

                                </div>

                                <p className="mt-1 text-sm leading-5 text-gray-600">
                                  {
                                    notification.message
                                  }
                                </p>

                                <p className="mt-2 text-[11px] text-gray-400">
                                  {formatDate(
                                    notification.createdAt
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* Footer */}

                {notifications.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3">

                    <button
                      type="button"
                      onClick={
                        fetchNotifications
                      }
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 py-1 text-xs font-semibold text-purple-600 transition hover:text-purple-700 disabled:opacity-50"
                    >

                      <RefreshCw
                        size={14}
                        className={
                          isLoading
                            ? "animate-spin"
                            : ""
                        }
                      />

                      Refresh notifications

                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              PROFILE — DESKTOP
          ================================================= */}

          <Link
            href="/settings"
            className="hidden items-center gap-3 rounded-2xl border border-transparent px-2 py-1.5 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50 sm:flex"
          >

            <div className="relative">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-sm font-black text-white shadow-[0_6px_18px_rgba(124,58,237,0.20)]">
                A
              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />

            </div>

            <div className="pr-1">

              <div className="flex items-center gap-1">

                <h3 className="text-sm font-bold text-gray-900">
                  Akash
                </h3>

                <ChevronDown
                  size={13}
                  className="text-gray-400"
                />

              </div>

              <p className="text-[10px] font-medium text-gray-400">
                Premium User
              </p>

            </div>

          </Link>

          {/* =================================================
              PROFILE — MOBILE
          ================================================= */}

          <Link
            href="/settings"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-sm font-black text-white shadow-sm transition-all duration-300 hover:scale-105 sm:hidden"
          >
            A

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </Link>

        </div>

      </div>
    </header>
  );
}