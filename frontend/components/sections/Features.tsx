"use client";

import {
    ArrowUpRight,
    Brain,
    ChartColumn,
    MessageSquare,
    Sparkles,
    Wallet,
} from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";
import ScrollMotion from "@/components/ui/ScrollMotion";
import { useEffect, useRef, useState } from "react";

const features = [
    {
        number: "01",
        icon: Brain,
        eyebrow: "INTELLIGENCE",
        title: "Your money gets a brain.",
        description:
            "Finora understands your financial profile and turns your numbers into practical decisions you can actually act on.",
        accent: "purple",
    },
    {
        number: "02",
        icon: Wallet,
        eyebrow: "CONTROL",
        title: "See where every rupee goes.",
        description:
            "Track income, expenses, budgets and savings in one clear financial picture instead of scattered apps and spreadsheets.",
        accent: "green",
    },
    {
        number: "03",
        icon: ChartColumn,
        eyebrow: "CLARITY",
        title: "Know what you can safely spend.",
        description:
            "Finora helps you understand your monthly surplus so you can spend with confidence without losing sight of your goals.",
        accent: "blue",
    },
    {
        number: "04",
        icon: MessageSquare,
        eyebrow: "CONVERSATION",
        title: "Your financial conversations never disappear.",
        description:
            "Ask Finora anything about your finances and return to previous conversations whenever you need them.",
        accent: "orange",
    },
];

function accentClasses(accent: string) {
    switch (accent) {
        case "green":
            return {
                icon: "bg-green-100 text-green-600",
                glow: "bg-green-400/10",
                line: "from-green-500/0 via-green-500/60 to-green-500/0",
                badge: "bg-green-50 text-green-700 border-green-100",
            };

        case "blue":
            return {
                icon: "bg-blue-100 text-blue-600",
                glow: "bg-blue-400/10",
                line: "from-blue-500/0 via-blue-500/60 to-blue-500/0",
                badge: "bg-blue-50 text-blue-700 border-blue-100",
            };

        case "orange":
            return {
                icon: "bg-orange-100 text-orange-600",
                glow: "bg-orange-400/10",
                line: "from-orange-500/0 via-orange-500/60 to-orange-500/0",
                badge: "bg-orange-50 text-orange-700 border-orange-100",
            };

        default:
            return {
                icon: "bg-purple-100 text-purple-600",
                glow: "bg-purple-400/10",
                line: "from-purple-500/0 via-purple-500/60 to-purple-500/0",
                badge: "bg-purple-50 text-purple-700 border-purple-100",
            };
    }
}

function FeatureCard({
    feature,
    index,
}: {
    feature: (typeof features)[number];
    index: number;
}) {
    const cardRef = useRef<HTMLElement | null>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const element = cardRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setActive(entry.isIntersecting);
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const Icon = feature.icon;
    const styles = accentClasses(feature.accent);
    const isEven = index % 2 === 1;

    return (
        <article
            ref={cardRef}
            className={`group relative overflow-hidden rounded-[32px] border border-gray-200/80 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)] transition-all duration-700 ${
                active
                    ? "-translate-y-1 border-gray-300 shadow-[0_30px_80px_rgba(17,24,39,0.11)]"
                    : ""
            }`}
        >
            {/* =====================================================
                TOP LIGHT LINE
            ===================================================== */}

            <div
                className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${styles.line}`}
            />

            {/* =====================================================
                CARD AMBIENT GLOW
            ===================================================== */}

            <div
                className={`pointer-events-none absolute ${
                    isEven ? "-right-24" : "-left-24"
                } top-1/2 h-72 w-72 -translate-y-1/2 rounded-full ${
                    styles.glow
                } blur-3xl transition-all duration-1000 ${
                    active
                        ? "scale-125 opacity-100"
                        : "scale-75 opacity-0"
                }`}
            />

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div
                className={`relative grid min-h-[360px] items-center gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-14 ${
                    isEven
                        ? "lg:[&>*:first-child]:order-2"
                        : ""
                }`}
            >
                {/* =================================================
                    TEXT
                ================================================= */}

                <div
                    className={`transition-all duration-700 ${
                        active
                            ? "translate-y-0 opacity-100"
                            : "translate-y-5 opacity-70"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black tracking-[0.2em] text-gray-300">
                            {feature.number}
                        </span>

                        <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.15em] ${styles.badge}`}
                        >
                            {feature.eyebrow}
                        </span>
                    </div>

                    <h3 className="mt-6 max-w-xl text-3xl font-black tracking-[-0.025em] text-gray-950 sm:text-4xl">
                        {feature.title}
                    </h3>

                    <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                        {feature.description}
                    </p>

                    <button
                        type="button"
                        className="group/button mt-7 inline-flex items-center gap-2 text-sm font-bold text-gray-900"
                    >
                        Explore feature

                        <ArrowUpRight
                            size={16}
                            className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                        />
                    </button>
                </div>

                {/* =================================================
                    VISUAL + SCROLL PARALLAX
                ================================================= */}

                <ScrollMotion
                    className="relative w-full"
                    strength={28}
                >
                    <div
                        className={`relative flex min-h-[280px] items-center justify-center transition-all duration-500 ${
                            active
                                ? "opacity-100"
                                : "opacity-80"
                        }`}
                    >
                        {/* =============================================
                            DEEP BACKGROUND GLOW
                        ============================================= */}

                        <div
                            className={`absolute h-56 w-56 rounded-full ${
                                styles.glow
                            } blur-3xl transition-all duration-1000 ${
                                active
                                    ? "scale-125 opacity-100"
                                    : "scale-90 opacity-60"
                            }`}
                            style={{
                                transform: active
                                    ? "translateY(-12px) scale(1.25)"
                                    : "translateY(12px) scale(0.9)",
                            }}
                        />

                        {/* =============================================
                            MAIN VISUAL
                        ============================================= */}

                        <div
                            className={`relative z-10 w-full max-w-[390px] transition-transform duration-700 ${
                                active
                                    ? "scale-[1.02]"
                                    : "scale-100"
                            }`}
                        >
                            <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50 p-5 shadow-xl transition-shadow duration-700 group-hover:shadow-2xl sm:p-6">

                                {/* Subtle top shine */}

                                <div
                                    className={`pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent transition-opacity duration-700 ${
                                        active
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                />

                                {/* =====================================
                                    VISUAL HEADER
                                ===================================== */}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon} transition-transform duration-500 ${
                                                active
                                                    ? "scale-105"
                                                    : ""
                                            }`}
                                        >
                                            <Icon size={21} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-400">
                                                Finora
                                            </p>

                                            <p className="text-sm font-bold text-gray-900">
                                                {feature.eyebrow}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={`h-2 w-2 rounded-full bg-green-500 shadow-[0_0_14px_rgba(34,197,94,0.6)] transition-all duration-500 ${
                                            active
                                                ? "scale-125"
                                                : ""
                                        }`}
                                    />
                                </div>

                                {/* =====================================
                                    FEATURE 01 — AI
                                ===================================== */}

                                {index === 0 && (
                                    <div className="mt-7 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-600 p-5 text-white transition-transform duration-700 group-hover:-translate-y-1">

                                        <div className="flex items-center gap-2 text-xs text-purple-100">
                                            <Sparkles size={14} />
                                            Finora AI
                                        </div>

                                        <p className="mt-4 text-sm leading-6">
                                            Your spending is on track.
                                            You can safely allocate
                                            another ₹8,000 toward
                                            your goal this month.
                                        </p>

                                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
                                            <div
                                                className={`h-full rounded-full bg-white transition-all duration-[1200ms] ${
                                                    active
                                                        ? "w-[91%]"
                                                        : "w-[20%]"
                                                }`}
                                            />
                                        </div>

                                        <div className="mt-2 flex justify-between text-[10px] text-purple-100">
                                            <span>
                                                AI confidence
                                            </span>

                                            <span className="font-bold text-white">
                                                91%
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* =====================================
                                    FEATURE 02 — FINANCIAL PROFILE
                                ===================================== */}

                                {index === 1 && (
                                    <div className="mt-7 space-y-3">

                                        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all duration-500 group-hover:-translate-y-1">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Income
                                                </p>

                                                <p className="mt-1 font-bold text-gray-900">
                                                    ₹75,000
                                                </p>
                                            </div>

                                            <span className="text-xs font-bold text-green-600">
                                                +5.2%
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all delay-75 duration-500 group-hover:translate-y-1">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Expenses
                                                </p>

                                                <p className="mt-1 font-bold text-gray-900">
                                                    ₹36,200
                                                </p>
                                            </div>

                                            <span className="text-xs font-bold text-red-500">
                                                -2.8%
                                            </span>
                                        </div>

                                    </div>
                                )}

                                {/* =====================================
                                    FEATURE 03 — SURPLUS
                                ===================================== */}

                                {index === 2 && (
                                    <div className="mt-7">

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Safe to spend
                                                </p>

                                                <p className="mt-1 text-3xl font-black text-gray-950">
                                                    ₹38.5K
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                                +12%
                                            </span>
                                        </div>

                                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-[1200ms] ${
                                                    active
                                                        ? "w-[76%]"
                                                        : "w-[18%]"
                                                }`}
                                            />
                                        </div>

                                        <div className="mt-3 flex justify-between text-[10px] text-gray-400">
                                            <span>
                                                Spending
                                            </span>

                                            <span>
                                                Savings goal
                                            </span>
                                        </div>

                                    </div>
                                )}

                                {/* =====================================
                                    FEATURE 04 — CONVERSATION
                                ===================================== */}

                                {index === 3 && (
                                    <div className="mt-7 space-y-3">

                                        <div className="rounded-2xl bg-white p-4 shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
                                            <div className="flex items-center gap-3">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                                    <Sparkles
                                                        size={15}
                                                        className="text-purple-600"
                                                    />
                                                </div>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    How can I reduce my
                                                    spending?
                                                </p>

                                            </div>
                                        </div>

                                        <div
                                            className={`ml-8 rounded-2xl bg-orange-50 p-4 transition-all duration-700 ${
                                                active
                                                    ? "translate-x-0 opacity-100"
                                                    : "translate-x-4 opacity-0"
                                            }`}
                                        >
                                            <p className="text-xs leading-5 text-orange-900">
                                                Start by reviewing your
                                                highest discretionary
                                                spending categories.
                                            </p>
                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* =========================================
                                FLOATING STATUS BADGE
                            ========================================= */}

                            <div
                                className={`absolute -bottom-4 -right-3 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-[10px] font-bold text-gray-700 shadow-lg transition-all duration-700 sm:-right-5 ${
                                    active
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-3 opacity-0"
                                }`}
                            >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

                                Smart & connected
                            </div>

                        </div>
                    </div>
                </ScrollMotion>
            </div>
        </article>
    );
}

export default function Features() {
    return (
        <section
            id="features"
            className="relative overflow-hidden bg-[#fafafa] py-28 sm:py-36"
        >
            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="pointer-events-none absolute inset-0">

                <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-200/20 blur-[120px]" />

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />

            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* =================================================
                    INTRO
                ================================================= */}

                <FadeIn>

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-700">
                            <Sparkles size={14} />
                            Built around your money
                        </div>

                        <h2 className="mt-7 text-4xl font-black tracking-[-0.035em] text-gray-950 sm:text-5xl lg:text-6xl">
                            Your entire financial life.
                            <br />

                            <span className="bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                                One intelligent system.
                            </span>
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                            Finora combines your financial data,
                            intelligent analysis and simple
                            decision-making tools into one
                            experience built to help you move
                            forward.
                        </p>

                    </div>

                </FadeIn>

                {/* =================================================
                    FEATURES
                ================================================= */}

                <div className="mt-20 space-y-6 sm:mt-24">

                    {features.map(
                        (feature, index) => (
                            <FadeIn
                                key={feature.number}
                                delay={index * 0.08}
                            >
                                <FeatureCard
                                    feature={feature}
                                    index={index}
                                />
                            </FadeIn>
                        )
                    )}

                </div>

                {/* =================================================
                    BOTTOM STATEMENT
                ================================================= */}

                <FadeIn delay={0.2}>

                    <div className="mx-auto mt-20 max-w-3xl text-center sm:mt-24">

                        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Less guessing.

                            <span className="text-purple-600">
                                {" "}
                                More knowing.
                            </span>
                        </p>

                        <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
                            Finora is designed to make financial
                            decisions feel simpler, clearer and
                            more intentional.
                        </p>

                    </div>

                </FadeIn>

            </div>
        </section>
    );
}