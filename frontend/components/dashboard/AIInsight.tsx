"use client";

import {
  Bot,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  Zap,
} from "lucide-react";

type AIInsightData = {
  text: string;
  savingsRate: number;
  biggestExpense?: {
    name: string;
    value: number;
    percentage: number;
  } | null;
};

type Props = {
  insight: AIInsightData;
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function AIInsight({ insight }: Props) {
  const savingsRate = Number(insight.savingsRate || 0);

  const savingsProgress = Math.min(
    Math.max(savingsRate, 0),
    100
  );

  return (
    <section
      className="
        group
        relative
        h-full
        overflow-hidden
        rounded-[30px]
        border
        border-purple-400/20
        bg-[#24103f]
        p-6
        text-white
        shadow-[0_25px_80px_rgba(76,29,149,0.22)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_32px_90px_rgba(76,29,149,0.30)]
        sm:p-7
      "
    >
      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-purple-500/20
          blur-[90px]
          transition-all
          duration-1000
          ease-out
          group-hover:scale-125
          group-hover:bg-purple-400/25
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-32
          h-80
          w-80
          rounded-full
          bg-indigo-500/15
          blur-[100px]
          transition-transform
          duration-1000
          group-hover:scale-110
        "
      />

      {/* Moving glow */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/2
          h-40
          w-40
          rounded-full
          bg-violet-400/[0.07]
          blur-[70px]
          transition-transform
          duration-[2000ms]
          group-hover:translate-x-[420px]
        "
      />

      {/* =====================================================
          DECORATIVE ORBIT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-35px]
          top-[-35px]
          h-40
          w-40
          rounded-full
          border
          border-white/[0.07]
          transition-transform
          duration-1000
          group-hover:rotate-12
          group-hover:scale-110
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-5px]
          top-[-5px]
          h-24
          w-24
          rounded-full
          border
          border-white/[0.06]
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            {/* AI ICON */}

            <div
              className="
                relative
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-white/15
                bg-white/[0.12]
                shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                backdrop-blur-md
                transition-all
                duration-500
                group-hover:scale-105
                group-hover:shadow-[0_12px_35px_rgba(255,255,255,0.10)]
              "
            >

              {/* Icon glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-2xl
                  bg-white/10
                  opacity-0
                  blur-md
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              <Bot
                size={24}
                strokeWidth={2}
                className="
                  relative
                  z-10
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              />

              {/* ONLINE */}

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#24103f]
                  bg-emerald-400
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>

            </div>

            {/* TITLE */}

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                  Finora AI
                </h2>

                <span
                  className="
                    rounded-full
                    border
                    border-emerald-300/20
                    bg-emerald-300/10
                    px-2
                    py-0.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-emerald-300
                  "
                >
                  Online
                </span>

              </div>

              <p className="mt-1 text-xs text-purple-200 sm:text-sm">
                Your intelligent financial assistant
              </p>

            </div>

          </div>

          {/* SPARKLE */}

          <div
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-white/10
              bg-white/[0.08]
              transition-all
              duration-500
              group-hover:rotate-12
              group-hover:bg-white/[0.14]
            "
          >

            <Sparkles
              size={19}
              className="
                transition-transform
                duration-700
                group-hover:scale-110
              "
            />

          </div>

        </div>

        {/* ===================================================
            AI INSIGHT
        ==================================================== */}

        <div
          className="
            relative
            mt-7
            overflow-hidden
            rounded-[22px]
            border
            border-white/10
            bg-white/[0.09]
            p-5
            backdrop-blur-md
            transition-all
            duration-500
            hover:bg-white/[0.12]
          "
        >

          {/* Insight glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-10
              h-28
              w-28
              rounded-full
              bg-purple-300/10
              blur-3xl
            "
          />

          <div className="relative">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/10
                  "
                >
                  <BrainCircuit size={14} />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-purple-200">
                  AI Insight
                </span>

              </div>

              <Zap
                size={14}
                className="
                  text-purple-200/60
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

            </div>

            <p className="mt-4 text-[15px] leading-7 text-white/95 sm:text-base">
              {insight.text ||
                "Keep tracking your finances to unlock personalized recommendations."}
            </p>

          </div>

        </div>

        {/* ===================================================
            METRICS
        ==================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">

          {/* =================================================
              SAVINGS RATE
          ================================================== */}

          <div
            className="
              group/metric
              rounded-[20px]
              border
              border-white/10
              bg-white/[0.08]
              p-4
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-white/[0.13]
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 text-purple-100">

                <TrendingUp size={15} />

                <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">
                  Savings rate
                </span>

              </div>

              <ArrowUpRight
                size={14}
                className="
                  text-white/40
                  transition-all
                  duration-300
                  group-hover/metric:-translate-y-0.5
                  group-hover/metric:translate-x-0.5
                  group-hover/metric:text-white
                "
              />

            </div>

            <div className="mt-3 flex items-end justify-between">

              <p className="text-2xl font-black tracking-tight">
                {savingsRate.toFixed(1)}%
              </p>

              <span className="text-[9px] font-semibold text-purple-200">
                Monthly
              </span>

            </div>

            {/* Progress */}

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">

              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-white
                  to-purple-200
                  shadow-[0_0_12px_rgba(255,255,255,0.35)]
                  transition-all
                  duration-[1200ms]
                  ease-out
                "
                style={{
                  width: `${savingsProgress}%`,
                }}
              />

            </div>

          </div>

          {/* =================================================
              BIGGEST EXPENSE
          ================================================== */}

          {insight.biggestExpense ? (
            <div
              className="
                group/metric
                min-w-0
                rounded-[20px]
                border
                border-white/10
                bg-white/[0.08]
                p-4
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-white/[0.13]
              "
            >

              <div className="flex items-center justify-between gap-2">

                <span className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-purple-100">
                  Largest expense
                </span>

                <ArrowUpRight
                  size={14}
                  className="
                    shrink-0
                    text-white/40
                    transition-all
                    duration-300
                    group-hover/metric:-translate-y-0.5
                    group-hover/metric:translate-x-0.5
                    group-hover/metric:text-white
                  "
                />

              </div>

              <p className="mt-3 truncate text-base font-black">
                {insight.biggestExpense.name}
              </p>

              <p className="mt-1 text-sm font-medium text-purple-100">
                {formatCurrency(
                  insight.biggestExpense.value
                )}
              </p>

              <div className="mt-2 flex items-center justify-between gap-2">

                <span className="text-[9px] text-white/45">
                  of total expenses
                </span>

                <span className="rounded-md bg-white/[0.08] px-1.5 py-1 text-[9px] font-bold text-purple-100">
                  {Number(
                    insight.biggestExpense
                      .percentage || 0
                  ).toFixed(1)}
                  %
                </span>

              </div>

            </div>
          ) : (
            <div
              className="
                rounded-[20px]
                border
                border-white/10
                bg-white/[0.08]
                p-4
                backdrop-blur-md
              "
            >

              <div className="flex items-center gap-2 text-purple-100">

                <ShieldCheck size={15} />

                <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">
                  Financial activity
                </span>

              </div>

              <p className="mt-3 text-sm font-bold">
                Add transactions
              </p>

              <p className="mt-1 text-xs leading-5 text-purple-100">
                to unlock deeper AI insights
              </p>

            </div>
          )}

        </div>

        {/* ===================================================
            STATUS
        ==================================================== */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            border-t
            border-white/10
            pt-4
            min-[420px]:flex-row
            min-[420px]:items-center
            min-[420px]:justify-between
          "
        >

          <div className="flex items-center gap-2">

            <span className="relative flex h-2 w-2">

              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-emerald-300
                  opacity-60
                "
              />

              <span className="relative h-2 w-2 rounded-full bg-emerald-300" />

            </span>

            <span className="text-[10px] font-medium text-purple-100">
              AI monitoring your finances
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
              Finora Intelligence
            </span>

            <Sparkles
              size={11}
              className="text-purple-300/50"
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM LIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-10
          right-10
          h-px
          bg-gradient-to-r
          from-transparent
          via-purple-300/40
          to-transparent
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

    </section>
  );
}