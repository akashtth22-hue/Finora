"use client";

import Link from "next/link";
import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

export default function CTA() {
    return (
        <section className="relative isolate overflow-hidden bg-gray-950 py-24 sm:py-32">

            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="pointer-events-none absolute inset-0">

                {/* Purple ambient glow */}
                <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/20 blur-[120px]" />

                <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-violet-700/15 blur-[100px]" />

                <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-indigo-700/15 blur-[100px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.045]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize:
                            "56px 56px",
                    }}
                />

                {/* Floating lights */}
                <div className="absolute left-[15%] top-[25%] h-2 w-2 animate-pulse rounded-full bg-purple-400 shadow-[0_0_25px_8px_rgba(168,85,247,0.25)]" />

                <div
                    className="absolute right-[18%] bottom-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"
                    style={{
                        animationDelay:
                            "900ms",
                    }}
                />

            </div>

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">

                {/* Badge */}

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200 backdrop-blur-md">

                    <Sparkles
                        size={14}
                    />

                    Your money deserves better

                </div>

                {/* Heading */}

                <h2 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">

                    Stop guessing about your money.

                    <span className="block bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
                        Start making smarter decisions.
                    </span>

                </h2>

                {/* Description */}

                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
                    Build better financial habits, understand your
                    spending and make confident decisions with
                    Finora's intelligent financial experience.
                </p>

                {/* =================================================
                    CTA
                ================================================= */}

                <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

                    <Link
                        href="/register"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-gray-950 shadow-[0_10px_35px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-[0_15px_45px_rgba(255,255,255,0.18)]"
                    >
                        Get Started Free

                        <ArrowRight
                            size={17}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>

                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
                    >
                        I already have an account
                    </Link>

                </div>

                {/* =================================================
                    TRUST POINTS
                ================================================= */}

                <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500">

                    <div className="flex items-center gap-2">
                        <CheckCircle2
                            size={14}
                            className="text-green-400"
                        />
                        AI-powered insights
                    </div>

                    <div className="flex items-center gap-2">
                        <CheckCircle2
                            size={14}
                            className="text-green-400"
                        />
                        Personal financial dashboard
                    </div>

                    <div className="flex items-center gap-2">
                        <CheckCircle2
                            size={14}
                            className="text-green-400"
                        />
                        Smarter money decisions
                    </div>

                </div>

                {/* =================================================
                    MINI AI VISUAL
                ================================================= */}

                <div className="relative mx-auto mt-16 max-w-2xl">

                    {/* Glow */}

                    <div className="absolute left-1/2 top-1/2 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[70px]" />

                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 text-left shadow-2xl backdrop-blur-xl sm:p-6">

                        {/* Top line */}

                        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                                    <BrainCircuit
                                        size={20}
                                    />
                                </div>

                                <div>

                                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                        Finora AI
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-white">
                                        Your financial co-pilot
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-1.5 rounded-full border border-green-400/10 bg-green-400/5 px-2.5 py-1 text-[10px] font-bold text-green-300">

                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400" />

                                    <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
                                </span>

                                READY

                            </div>

                        </div>

                        <div className="mt-5 rounded-2xl border border-white/5 bg-black/10 p-4">

                            <p className="text-xs leading-6 text-gray-400 sm:text-sm">
                                "Your spending is under control this
                                month. You have room to increase your
                                savings contribution while keeping
                                your budget healthy."
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-purple-300">

                                <Sparkles
                                    size={13}
                                />

                                Personalized to your financial profile

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}