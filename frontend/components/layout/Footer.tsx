"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    BrainCircuit,
    Mail,
    Sparkles,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-gray-950 text-white">

            {/* =====================================================
                AMBIENT BACKGROUND
            ===================================================== */}

            <div className="pointer-events-none absolute inset-0">

                <div className="absolute left-1/2 top-0 h-[400px] w-[650px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-[120px]" />

                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-700/10 blur-[100px]" />

                <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-indigo-700/10 blur-[100px]" />

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />

            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* =================================================
                    TOP CTA
                ================================================= */}

                <div className="border-b border-white/10 py-16 sm:py-20">

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                        <div className="max-w-2xl">

                            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">

                                <Sparkles size={13} />

                                Intelligent finance

                            </div>

                            <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                                Your money.
                                <span className="text-purple-400">
                                    {" "}
                                    Smarter.
                                </span>
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                                Make better financial decisions with an
                                intelligent system built around your
                                money.
                            </p>

                        </div>

                        <Link
                            href="/register"
                            className="group inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-950 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            Get Started

                            <ArrowUpRight
                                size={17}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>

                    </div>

                </div>

                {/* =================================================
                    MAIN FOOTER
                ================================================= */}

                <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">

                    {/* BRAND */}

                    <div className="lg:col-span-2">

                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3"
                        >

                            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 shadow-lg shadow-purple-900/20 transition-transform duration-300 group-hover:scale-105">

                                <span className="relative z-10 text-lg font-black">
                                    ₹
                                </span>

                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                            </div>

                            <div>
                                <p className="text-xl font-black tracking-[-0.03em]">
                                    Finora
                                </p>

                                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                                    Intelligent Finance
                                </p>
                            </div>

                        </Link>

                        <p className="mt-6 max-w-md text-sm leading-7 text-gray-500">
                            Finora helps you understand your money,
                            make smarter decisions and build better
                            financial habits with AI.
                        </p>

                        {/* AI STATUS */}

                        <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                                <BrainCircuit size={16} />
                            </div>

                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                    Finora AI
                                </p>

                                <div className="mt-1 flex items-center gap-2">

                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400" />

                                        <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
                                    </span>

                                    <span className="text-xs font-semibold text-gray-300">
                                        Always learning
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* PRODUCT */}

                    <div>

                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                            Product
                        </h3>

                        <div className="mt-5 space-y-3">

                            <a
                                href="#features"
                                className="group flex w-fit items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                Features

                                <ArrowUpRight
                                    size={13}
                                    className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                            </a>

                            <Link
                                href="/dashboard"
                                className="group flex w-fit items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                Dashboard

                                <ArrowUpRight
                                    size={13}
                                    className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                            </Link>

                            <Link
                                href="/ai"
                                className="group flex w-fit items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                Finora AI

                                <ArrowUpRight
                                    size={13}
                                    className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                            </Link>

                        </div>

                    </div>

                    {/* COMPANY */}

                    <div>

                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                            Company
                        </h3>

                        <div className="mt-5 space-y-3">

                            <a
                                href="#about"
                                className="block w-fit text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                About
                            </a>

                            <Link
                                href="/contact"
                                className="group flex w-fit items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                Contact

                                <ArrowUpRight
                                    size={13}
                                    className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                            </Link>

                            <a
                                href="#"
                                className="block w-fit text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                Privacy
                            </a>

                            <a
                                href="#"
                                className="block w-fit text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                Terms
                            </a>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    BOTTOM BAR
                ================================================= */}

                <div className="flex flex-col gap-5 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-gray-600">
                        © 2026 Finora. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-600">

                        <Mail size={13} />

                        <span>
                            Built for smarter financial decisions.
                        </span>

                    </div>

                </div>

            </div>

        </footer>
    );
}