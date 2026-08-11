"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/75 backdrop-blur-xl">

            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

                {/* =====================================================
                    LOGO
                ===================================================== */}

                <Link
                    href="/"
                    className="group flex items-center gap-3"
                >
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 shadow-lg shadow-purple-600/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-600/30">

                        <span className="relative z-10 text-lg font-black text-white">
                            ₹
                        </span>

                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    </div>

                    <div className="leading-none">
                        <span className="text-xl font-black tracking-[-0.03em] text-gray-950">
                            Finora
                        </span>

                        <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Intelligent Finance
                        </span>
                    </div>
                </Link>

                {/* =====================================================
                    DESKTOP NAVIGATION
                ===================================================== */}

                <div className="hidden items-center gap-1 md:flex">

                    <a
                        href="#features"
                        className="group relative flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700"
                    >
                        Features
                    </a>

                    <a
                        href="#features"
                        className="group flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700"
                    >
                        How it works
                    </a>

                    <a
                        href="#about"
                        className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700"
                    >
                        About
                    </a>

                    <Link
                        href="/contact"
                        className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700"
                    >
                        Contact
                    </Link>

                </div>

                {/* =====================================================
                    RIGHT ACTIONS
                ===================================================== */}

                <div className="hidden items-center gap-3 md:flex">

                    <Link
                        href="/login"
                        className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-950"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/register"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                    >

                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                        <Sparkles
                            size={15}
                            className="relative text-purple-300"
                        />

                        <span className="relative">
                            Get Started
                        </span>

                        <ArrowUpRight
                            size={15}
                            className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />

                    </Link>

                </div>

                {/* =====================================================
                    MOBILE ACTION
                ===================================================== */}

                <Link
                    href="/login"
                    className="flex items-center gap-1 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-gray-800 md:hidden"
                >
                    Login
                    <ArrowUpRight size={15} />
                </Link>

            </div>

        </nav>
    );
}