"use client";

import Link from "next/link";
import {
    Bell,
    Menu,
    CheckCheck,
    AlertCircle,
    X,
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

    /* ================= FETCH NOTIFICATIONS ================= */

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

    /* ================= INITIAL LOAD ================= */

    useEffect(() => {
        fetchNotifications();
    }, []);

    /* ================= CLOSE DROPDOWN ================= */

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

    /* ================= HELPERS ================= */

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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <AlertCircle size={18} />
                    </div>
                );

            case "BUDGET_WARNING":
                return (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <AlertCircle size={18} />
                    </div>
                );

            case "SAVINGS_PROGRESS":
                return (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                        <CheckCheck size={18} />
                    </div>
                );

            case "SAVINGS_DEADLINE":
                return (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Bell size={18} />
                    </div>
                );

            default:
                return (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                        <Bell size={18} />
                    </div>
                );
        }
    }

    function formatDate(
        dateString: string
    ) {
        const date =
            new Date(dateString);

        const now = new Date();

        const difference =
            now.getTime() -
            date.getTime();

        const minutes = Math.floor(
            difference /
                (1000 * 60)
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
        <header className="border-b border-gray-200 bg-white">

            <div className="flex min-h-[80px] items-center gap-3 px-4 sm:px-6">

                {/* ================= MOBILE MENU ================= */}

                <button
                    onClick={() =>
                        setMobileMenuOpen(
                            true
                        )
                    }
                    className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-50 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* ================= WELCOME ================= */}

                <div className="min-w-0 flex-1">

                    <h1 className="truncate text-lg font-bold text-gray-900 sm:text-2xl">
                        Welcome Back 👋
                    </h1>

                    <p className="mt-1 hidden text-sm text-gray-500 sm:block">
                        Here's your financial overview today.
                    </p>

                </div>

                {/* ================= RIGHT ================= */}

                <div className="flex items-center gap-2 sm:gap-4">

                    {/* ================= NOTIFICATIONS ================= */}

                    <div
                        ref={notificationRef}
                        className="relative"
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setIsOpen(
                                    (value) =>
                                        !value
                                )
                            }
                            className="relative rounded-xl border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-50 sm:p-3"
                            aria-label="Notifications"
                            aria-expanded={
                                isOpen
                            }
                        >

                            <Bell size={20} />

                            {unreadCount >
                                0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                    {unreadCount >
                                    9
                                        ? "9+"
                                        : unreadCount}
                                </span>
                            )}

                        </button>

                        {/* ================= NOTIFICATION DROPDOWN ================= */}

                        {isOpen && (
                            <div className="absolute right-0 top-14 z-50 w-[350px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-[390px]">

                                {/* Header */}

                                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                                    <div>

                                        <h2 className="font-bold text-gray-900">
                                            Notifications
                                        </h2>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            Stay on top of your finances.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsOpen(
                                                false
                                            )
                                        }
                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                        aria-label="Close notifications"
                                    >
                                        <X
                                            size={
                                                18
                                            }
                                        />
                                    </button>

                                </div>

                                {/* Content */}

                                <div className="max-h-[420px] overflow-y-auto">

                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />

                                            <p className="mt-4 text-sm text-gray-500">
                                                Checking your finances...
                                            </p>

                                        </div>
                                    ) : notifications.length ===
                                      0 ? (
                                        <div className="px-5 py-12 text-center">

                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                                <Bell
                                                    size={
                                                        22
                                                    }
                                                />
                                            </div>

                                            <h3 className="mt-4 font-semibold text-gray-900">
                                                You're all caught up
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                No important financial alerts right now.
                                            </p>

                                        </div>
                                    ) : (
                                        <div>

                                            {notifications.map(
                                                (
                                                    notification
                                                ) => (
                                                    <div
                                                        key={
                                                            notification.id
                                                        }
                                                        className={`border-b border-gray-100 px-5 py-4 transition hover:bg-gray-50 ${
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
                                                                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-600" />
                                                                    )}

                                                                </div>

                                                                <p className="mt-1 text-sm leading-5 text-gray-600">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>

                                                                <p className="mt-2 text-xs text-gray-400">
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

                                {notifications.length >
                                    0 && (
                                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                fetchNotifications()
                                            }
                                            disabled={
                                                isLoading
                                            }
                                            className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 disabled:opacity-50"
                                        >
                                            <RefreshIcon
                                                spinning={
                                                    isLoading
                                                }
                                            />
                                            Refresh notifications
                                        </button>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                    {/* ================= DESKTOP PROFILE ================= */}

                    <Link
                        href="/settings"
                        className="hidden items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50 sm:flex"
                        aria-label="Open profile settings"
                    >

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

                    </Link>

                    {/* ================= MOBILE AVATAR ================= */}

                    <Link
                        href="/settings"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white transition hover:bg-purple-700 sm:hidden"
                        aria-label="Open profile settings"
                    >
                        A
                    </Link>

                </div>

            </div>

        </header>
    );
}

/* ================= REFRESH ICON ================= */

function RefreshIcon({
    spinning,
}: {
    spinning: boolean;
}) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={
                spinning
                    ? "animate-spin"
                    : ""
            }
        >
            <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
        </svg>
    );
}