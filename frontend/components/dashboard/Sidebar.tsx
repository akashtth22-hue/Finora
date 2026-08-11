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
    X,
    IndianRupee,
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
    async function handleLogout() {
        try {
            const response = await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
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

    return (
        <>
            {/* =====================================================
                DESKTOP SIDEBAR
            ====================================================== */}

            <aside className="hidden h-screen w-20 shrink-0 lg:block">
                <div
                    className="
                        group/sidebar
                        fixed
                        inset-y-0
                        left-0
                        z-40
                        flex
                        h-screen
                        w-20
                        flex-col
                        overflow-hidden
                        border-r
                        border-gray-200
                        bg-white
                        shadow-sm
                        transition-[width]
                        duration-300
                        ease-out
                        hover:w-64
                    "
                >
                    {/* ================= BRANDING ================= */}

                    <div className="flex h-[105px] shrink-0 items-start border-b border-gray-200 px-5 pt-5">
                        <div className="flex min-w-[224px] items-center gap-4">

                            {/* Logo */}

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                                <IndianRupee
                                    size={22}
                                    strokeWidth={2.5}
                                />
                            </div>

                            {/* Expanded branding */}

                            <div
                                className="
                                    min-w-0
                                    -translate-x-2
                                    opacity-0
                                    transition-all
                                    duration-300
                                    delay-75
                                    group-hover/sidebar:translate-x-0
                                    group-hover/sidebar:opacity-100
                                "
                            >
                                <h1 className="text-xl font-extrabold text-purple-600">
                                    Finora
                                </h1>

                                <p className="mt-0.5 whitespace-nowrap text-xs text-gray-500">
                                    Smart Personal Finance
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ================= NAVIGATION ================= */}

                    <nav className="flex-1 overflow-hidden p-4">
                        <div className="space-y-2">

                            {menuItems.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const Icon =
                                        item.icon;

                                    return (
                                        <Link
                                            key={
                                                item.title
                                            }
                                            href={
                                                item.href
                                            }
                                            className="
                                                group/item
                                                flex
                                                h-12
                                                min-w-[224px]
                                                items-center
                                                gap-4
                                                rounded-xl
                                                px-3
                                                text-gray-700
                                                transition-all
                                                duration-200
                                                hover:bg-purple-50
                                                hover:text-purple-600
                                            "
                                        >
                                            {/* Icon */}

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    transition-transform
                                                    duration-200
                                                    group-hover/item:scale-105
                                                "
                                            >
                                                <Icon
                                                    size={
                                                        22
                                                    }
                                                />
                                            </div>

                                            {/* Label */}

                                            <span
                                                className="
                                                    -translate-x-2
                                                    whitespace-nowrap
                                                    font-medium
                                                    opacity-0
                                                    transition-all
                                                    duration-300
                                                    group-hover/sidebar:translate-x-0
                                                    group-hover/sidebar:opacity-100
                                                "
                                                style={{
                                                    transitionDelay: `${index * 30 + 80}ms`,
                                                }}
                                            >
                                                {
                                                    item.title
                                                }
                                            </span>
                                        </Link>
                                    );
                                }
                            )}
                        </div>
                    </nav>

                    {/* ================= BOTTOM ACTIONS ================= */}

                    <div className="shrink-0 space-y-2 border-t border-gray-200 p-4">

                        {/* Settings */}

                        <Link
                            href="/settings"
                            className="
                                group/item
                                flex
                                h-12
                                min-w-[224px]
                                items-center
                                gap-4
                                rounded-xl
                                px-3
                                text-gray-700
                                transition-all
                                duration-200
                                hover:bg-gray-100
                                hover:text-gray-900
                            "
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                <Settings
                                    size={22}
                                />
                            </div>

                            <span
                                className="
                                    -translate-x-2
                                    whitespace-nowrap
                                    font-medium
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

                        {/* Logout */}

                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className="
                                group/item
                                flex
                                h-12
                                min-w-[224px]
                                items-center
                                gap-4
                                rounded-xl
                                px-3
                                text-red-600
                                transition-all
                                duration-200
                                hover:bg-red-50
                            "
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                <LogOut
                                    size={22}
                                />
                            </div>

                            <span
                                className="
                                    -translate-x-2
                                    whitespace-nowrap
                                    font-medium
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
                <div className="fixed inset-0 z-50 lg:hidden">

                    {/* Overlay */}

                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() =>
                            setMobileMenuOpen(
                                false
                            )
                        }
                    />

                    {/* Drawer */}

                    <aside className="relative flex h-full w-[280px] flex-col bg-white shadow-2xl">

                        {/* Mobile Header */}

                        <div className="flex items-center justify-between border-b border-gray-200 p-6">

                            <div>
                                <h1 className="text-2xl font-extrabold text-purple-600">
                                    Finora
                                </h1>

                                <p className="mt-1 text-xs text-gray-500">
                                    Smart Personal Finance
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setMobileMenuOpen(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
                                aria-label="Close menu"
                            >
                                <X
                                    size={22}
                                />
                            </button>
                        </div>

                        {/* Mobile Navigation */}

                        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                            {menuItems.map(
                                (item) => {
                                    const Icon =
                                        item.icon;

                                    return (
                                        <Link
                                            key={
                                                item.title
                                            }
                                            href={
                                                item.href
                                            }
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false
                                                )
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                                rounded-xl
                                                px-4
                                                py-3
                                                text-gray-700
                                                transition
                                                hover:bg-purple-50
                                                hover:text-purple-600
                                            "
                                        >
                                            <Icon
                                                size={
                                                    21
                                                }
                                            />

                                            <span className="font-medium">
                                                {
                                                    item.title
                                                }
                                            </span>
                                        </Link>
                                    );
                                }
                            )}
                        </nav>

                        {/* Mobile Bottom Actions */}

                        <div className="shrink-0 space-y-2 border-t border-gray-200 p-4">

                            {/* Settings */}

                            <Link
                                href="/settings"
                                onClick={() =>
                                    setMobileMenuOpen(
                                        false
                                    )
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-4
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-gray-700
                                    transition
                                    hover:bg-gray-100
                                "
                            >
                                <Settings
                                    size={21}
                                />

                                Settings
                            </Link>

                            {/* Logout */}

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-4
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-red-600
                                    transition
                                    hover:bg-red-50
                                "
                            >
                                <LogOut
                                    size={21}
                                />

                                Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}