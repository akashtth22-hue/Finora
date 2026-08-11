"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Mail,
    MessageSquare,
    Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/ui/FadeIn";
import FinoraBackground from "@/components/ui/FinoraBackground";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="relative isolate overflow-hidden bg-white py-24 sm:py-32">

                <FinoraBackground />

                <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    <FadeIn>
                        <div className="mx-auto max-w-3xl text-center">

                            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-700">
                                <Sparkles size={14} />
                                Let's talk
                            </div>

                            <h1 className="mt-7 text-5xl font-black tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-7xl">
                                Have a question?
                                <span className="block bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                    We're listening.
                                </span>
                            </h1>

                            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                                Whether you have a question about Finora,
                                want to share feedback, or simply want to
                                talk about smarter personal finance, we'd
                                love to hear from you.
                            </p>

                        </div>
                    </FadeIn>

                    {/* =================================================
                        CONTACT GRID
                    ================================================= */}

                    <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">

                        {/* =============================================
                            LEFT SIDE
                        ============================================= */}

                        <FadeIn delay={0.1}>

                            <div className="relative h-full overflow-hidden rounded-[32px] bg-gray-950 p-8 text-white shadow-2xl sm:p-10">

                                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

                                <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

                                <div className="relative z-10">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                                        <MessageSquare size={25} />
                                    </div>

                                    <h2 className="mt-7 text-3xl font-black tracking-tight">
                                        We'd love to hear from you.
                                    </h2>

                                    <p className="mt-4 text-sm leading-7 text-gray-400">
                                        Your feedback helps us build a
                                        better financial experience.
                                        Tell us what's working, what's
                                        missing, or what you'd like to
                                        see next.
                                    </p>

                                    {/* Contact details */}

                                    <div className="mt-10 space-y-5">

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-purple-300">
                                                <Mail size={17} />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                    Email
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-200">
                                                    hello@finora.app
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-purple-300">
                                                <Clock3 size={17} />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                    Response time
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-200">
                                                    Usually within 24 hours
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    {/* AI card */}

                                    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                                                <Sparkles size={16} />
                                            </div>

                                            <div>

                                                <p className="text-xs font-bold text-white">
                                                    Need an instant answer?
                                                </p>

                                                <p className="mt-1 text-[10px] text-gray-500">
                                                    Ask Finora AI instead.
                                                </p>

                                            </div>

                                        </div>

                                        <Link
                                            href="/ai"
                                            className="group mt-4 inline-flex items-center gap-2 text-xs font-bold text-purple-300 transition-colors hover:text-purple-200"
                                        >
                                            Talk to Finora AI

                                            <ArrowRight
                                                size={14}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </FadeIn>

                        {/* =============================================
                            FORM
                        ============================================= */}

                        <FadeIn delay={0.2}>

                            <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white p-7 shadow-[0_20px_70px_rgba(17,24,39,0.07)] sm:p-10">

                                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
                                        Contact form
                                    </p>

                                    <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                                        Send us a message
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-gray-500">
                                        Fill out the form and we'll get
                                        back to you as soon as possible.
                                    </p>

                                </div>

                                <form
                                    className="mt-8 space-y-5"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                    }}
                                >

                                    {/* Name + Email */}

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="text-xs font-bold text-gray-700"
                                            >
                                                Name
                                            </label>

                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Your name"
                                                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="text-xs font-bold text-gray-700"
                                            >
                                                Email
                                            </label>

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                            />
                                        </div>

                                    </div>

                                    {/* Subject */}

                                    <div>

                                        <label
                                            htmlFor="subject"
                                            className="text-xs font-bold text-gray-700"
                                        >
                                            Subject
                                        </label>

                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            placeholder="How can we help?"
                                            className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                        />

                                    </div>

                                    {/* Message */}

                                    <div>

                                        <label
                                            htmlFor="message"
                                            className="text-xs font-bold text-gray-700"
                                        >
                                            Message
                                        </label>

                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            placeholder="Tell us what's on your mind..."
                                            className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                        />

                                    </div>

                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
                                    >
                                        Send Message

                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </button>

                                    <p className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                                        <CheckCircle2
                                            size={13}
                                            className="text-green-500"
                                        />
                                        Your information stays private.
                                    </p>

                                </form>

                            </div>

                        </FadeIn>

                    </div>

                </div>

            </section>

            <Footer />
        </main>
    );
}