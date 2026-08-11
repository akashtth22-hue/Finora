"use client";
import FinoraBackground from "@/components/ui/FinoraBackground";

import Link from "next/link";
import {
    ArrowUpRight,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    Rocket,
    Sparkles,
    TrendingUp,
} from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function Hero() {
    return (
        <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden bg-white">

            <FinoraBackground />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                {/* Main purple glow */}
                <div className="absolute left-1/2 top-[-260px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-purple-200/30 blur-[120px]" />

                <div className="absolute -left-40 top-[25%] h-[420px] w-[420px] rounded-full bg-violet-200/25 blur-[110px]" />

                <div className="absolute -right-40 top-[40%] h-[420px] w-[420px] rounded-full bg-indigo-200/25 blur-[110px]" />

                {/* Fine grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
                        backgroundSize:
                            "48px 48px",
                    }}
                />

                {/* Animated orb */}
                <div className="absolute left-[18%] top-[28%] h-2 w-2 animate-pulse rounded-full bg-purple-500 shadow-[0_0_30px_8px_rgba(124,58,237,0.25)]" />

                <div
                    className="absolute right-[20%] top-[18%] h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500"
                    style={{
                        animationDelay:
                            "800ms",
                    }}
                />

            </div>

            {/* =====================================================
                HERO CONTENT
            ===================================================== */}

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-16 sm:px-6 lg:px-8 lg:py-20">

                <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16">

                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}

                    <FadeIn>

                        <div className="max-w-2xl">

                            {/* Eyebrow */}

                            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50/80 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm backdrop-blur">

                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
                                </span>

                                <Sparkles
                                    size={15}
                                />

                                AI-powered personal finance

                            </div>

                            {/* Heading */}

                            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-7xl">

                                Your money.
                                <br />

                                <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                    Your intelligence.
                                </span>

                            </h1>

                            {/* Description */}

                            <p className="mt-7 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                                Finora brings your spending,
                                budgeting, savings and financial
                                decisions into one intelligent
                                platform — so you always know
                                what your money should do next.
                            </p>

                            {/* Actions */}

                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                                <Link
                                    href="/register"
                                    className="group"
                                >
                                    <Button>
                                        <span className="flex items-center gap-2">
                                            Get Started Free

                                            <ArrowUpRight
                                                size={17}
                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </Button>
                                </Link>

                                <Link
                                    href="#features"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md"
                                >
                                    Explore Finora

                                    <ChevronRight
                                        size={17}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Link>

                            </div>

                            {/* Trust indicators */}

                            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                    />
                                    Smart budgeting
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                    />
                                    AI insights
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                    />
                                    Personal finance
                                </div>

                            </div>

                        </div>

                    </FadeIn>

                    {/* =================================================
                        RIGHT VISUAL
                    ================================================= */}

                    <FadeIn delay={0.15}>

                        <div className="relative mx-auto w-full max-w-[520px]">

                            {/* Ambient glow */}

                            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/15 blur-[90px]" />

                            {/* Floating income card */}

                            <div
                                className="absolute -left-2 top-10 z-20 hidden animate-[float_5s_ease-in-out_infinite] rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block lg:-left-10"
                            >
                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
                                        <TrendingUp
                                            size={18}
                                            className="text-green-600"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Monthly income
                                        </p>

                                        <p className="text-sm font-bold text-gray-900">
                                            ₹75,000
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Floating savings card */}

                            <div
                                className="absolute -right-2 bottom-32 z-20 hidden animate-[float_6s_ease-in-out_infinite] rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block lg:-right-10"
                                style={{
                                    animationDelay:
                                        "700ms",
                                }}
                            >
                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                                        <span className="text-sm font-bold text-purple-600">
                                            ₹
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Savings rate
                                        </p>

                                        <p className="text-sm font-bold text-purple-700">
                                            48.7%
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* =================================================
                                MAIN FINORA CARD
                            ================================================= */}

                            <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_30px_80px_rgba(76,29,149,0.16)] backdrop-blur-xl sm:p-7">

                                {/* Top shine */}

                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

                                {/* Header */}

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-medium text-gray-500">
                                            Financial overview
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">

                                            <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                                                ₹38,500
                                            </h2>

                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                                +12%
                                            </span>

                                        </div>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Monthly surplus
                                        </p>

                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                                        <BrainCircuit
                                            size={22}
                                        />
                                    </div>

                                </div>

                                {/* Progress */}

                                <div className="mt-7">

                                    <div className="mb-2 flex items-center justify-between text-xs">

                                        <span className="font-medium text-gray-500">
                                            Savings goal
                                        </span>

                                        <span className="font-bold text-purple-600">
                                            68%
                                        </span>

                                    </div>

                                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">

                                        <div className="relative h-full w-[68%] overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500">

                                            <div className="absolute inset-y-0 right-0 w-20 animate-[shimmer_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                                        </div>

                                    </div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        ₹20,000 saved toward your goal
                                    </p>

                                </div>

                                {/* Stats */}

                                <div className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">

                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 sm:p-4">

                                        <p className="text-[10px] font-medium text-gray-500 sm:text-xs">
                                            Income
                                        </p>

                                        <p className="mt-1.5 text-lg font-extrabold text-gray-900 sm:text-xl">
                                            ₹75K
                                        </p>

                                        <p className="mt-1 text-[10px] font-semibold text-green-600 sm:text-xs">
                                            +5.2%
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 sm:p-4">

                                        <p className="text-[10px] font-medium text-gray-500 sm:text-xs">
                                            Expenses
                                        </p>

                                        <p className="mt-1.5 text-lg font-extrabold text-gray-900 sm:text-xl">
                                            ₹36K
                                        </p>

                                        <p className="mt-1 text-[10px] font-semibold text-red-500 sm:text-xs">
                                            -2.8%
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 sm:p-4">

                                        <p className="text-[10px] font-medium text-gray-500 sm:text-xs">
                                            Savings
                                        </p>

                                        <p className="mt-1.5 text-lg font-extrabold text-gray-900 sm:text-xl">
                                            ₹20K
                                        </p>

                                        <p className="mt-1 text-[10px] font-semibold text-purple-600 sm:text-xs">
                                            +12%
                                        </p>

                                    </div>

                                </div>

                                {/* =================================================
                                    AI CARD
                                ================================================= */}

                                <div className="relative mt-5 overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-600 p-5 text-white shadow-lg sm:p-6">

                                    {/* Animated glow */}

                                    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                                    <div className="relative">

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                                                    <Sparkles
                                                        size={18}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-[11px] text-purple-100">
                                                        Finora AI
                                                    </p>

                                                    <h3 className="text-sm font-bold">
                                                        Smart recommendation
                                                    </h3>
                                                </div>

                                            </div>

                                            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide">

                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300" />

                                                    <span className="relative h-1.5 w-1.5 rounded-full bg-green-300" />
                                                </span>

                                                LIVE
                                            </div>

                                        </div>

                                        <p className="mt-5 text-sm leading-6 text-purple-50">
                                            You can safely purchase
                                            the ₹15,000 phone next
                                            month without affecting
                                            your savings goal.
                                        </p>

                                        <div className="mt-5">

                                            <div className="mb-2 flex justify-between text-[11px] text-purple-100">
                                                <span>
                                                    AI confidence
                                                </span>

                                                <span className="font-bold text-white">
                                                    92%
                                                </span>
                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">

                                                <div className="h-full w-[92%] rounded-full bg-white" />

                                            </div>

                                        </div>

                                        <div className="mt-5 flex items-center gap-2 text-xs font-semibold">

                                            <CheckCircle2
                                                size={15}
                                                className="text-green-300"
                                            />

                                            Financially safe

                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* Bottom floating label */}

                            <div
                                className="absolute -bottom-5 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-lg sm:flex"
                            >
                                <Rocket
                                    size={14}
                                    className="text-purple-600"
                                />

                                Smarter decisions, every day
                            </div>

                        </div>

                    </FadeIn>

                </div>

            </div>

            {/* =====================================================
                SCROLL INDICATOR
            ===================================================== */}

            <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-gray-400 lg:flex">

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                    Scroll to explore
                </span>

                <div className="flex h-9 w-5 items-start justify-center rounded-full border border-gray-300 p-1.5">

                    <div className="h-1.5 w-1 rounded-full bg-gray-400 animate-bounce" />

                </div>

            </div>

            {/* =====================================================
                LOCAL KEYFRAMES
            ===================================================== */}

            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-120px);
                    }

                    100% {
                        transform: translateX(420px);
                    }
                }
            `}</style>

        </section>
    );
}