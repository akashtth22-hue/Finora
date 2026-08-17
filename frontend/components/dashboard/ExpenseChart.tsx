"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import {
  PieChart as PieChartIcon,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const COLORS = [
  "#7C3AED",
  "#8B5CF6",
  "#A855F7",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#14B8A6",
];

type ExpenseItem = {
  name: string;
  value: number;
  percentage: number;
};

type Props = {
  data: ExpenseItem[];
};

function formatCurrency(value: number): string {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function ExpenseChart({
  data,
}: Props) {
  const safeData = Array.isArray(data)
    ? data.filter(
        (item) =>
          Number(item?.value || 0) > 0
      )
    : [];

  const total = safeData.reduce(
    (sum, item) =>
      sum + Number(item.value || 0),
    0
  );

  const visibleCategories = safeData
    .slice()
    .sort(
      (a, b) =>
        Number(b.value || 0) -
        Number(a.value || 0)
    )
    .slice(0, 6);

  const topCategory = visibleCategories[0];

  return (
    <section
      className="
        group
        relative
        h-full
        overflow-hidden
        rounded-[30px]
        border
        border-gray-200/80
        bg-white
        p-5
        shadow-[0_18px_60px_rgba(30,20,60,0.05)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-purple-100
        hover:shadow-[0_28px_80px_rgba(30,20,60,0.09)]
        sm:p-7
      "
    >
      {/* =====================================================
          AMBIENT LIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-purple-500/[0.055]
          blur-[80px]
          transition-all
          duration-1000
          group-hover:scale-125
          group-hover:bg-purple-500/[0.09]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-24
          h-60
          w-60
          rounded-full
          bg-indigo-500/[0.035]
          blur-[80px]
        "
      />

      {/* Top accent */}

      <div
        className="
          pointer-events-none
          absolute
          left-10
          right-10
          top-0
          h-[2px]
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-purple-400/50
          to-transparent
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <div className="relative">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex items-start justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            {/* Icon */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-purple-100
                bg-gradient-to-br
                from-purple-50
                via-violet-50
                to-indigo-100/70
                text-purple-600
                shadow-sm
                transition-all
                duration-500
                group-hover:scale-105
                group-hover:shadow-[0_10px_25px_rgba(124,58,237,0.12)]
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-2xl
                  bg-purple-400/15
                  opacity-0
                  blur-md
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              <PieChartIcon
                size={19}
                className="
                  relative
                  z-10
                  transition-transform
                  duration-500
                  group-hover:rotate-6
                  group-hover:scale-110
                "
              />

            </div>

            {/* Title */}

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Spending analysis
              </p>

              <h2 className="truncate text-lg font-black tracking-tight text-gray-950 sm:text-xl">
                Expense Breakdown
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Where your money goes
              </p>

            </div>

          </div>

          {/* Period */}

          <span
            className="
              shrink-0
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-3
              py-2
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-gray-500
              transition-all
              duration-300
              group-hover:border-purple-100
              group-hover:bg-purple-50
              group-hover:text-purple-500
            "
          >
            This month
          </span>

        </div>

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {safeData.length === 0 ? (

          <div className="flex h-[390px] items-center justify-center text-center">

            <div>

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50
                  text-gray-300
                  shadow-sm
                  transition-all
                  duration-500
                  group-hover:scale-105
                "
              >
                <PieChartIcon size={28} />
              </div>

              <p className="mt-4 font-bold text-gray-700">
                No expenses yet
              </p>

              <p className="mx-auto mt-1 max-w-[240px] text-xs leading-5 text-gray-500">
                Add expenses to see your spending breakdown and understand where your money goes.
              </p>

            </div>

          </div>

        ) : (

          <>

            {/* =================================================
                CHART
            ================================================== */}

            <div className="relative mt-4 h-[250px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={safeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={98}
                    paddingAngle={4}
                    stroke="white"
                    strokeWidth={3}
                    animationBegin={100}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >

                    {safeData.map(
                      (entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                          className="
                            transition-opacity
                            duration-300
                            hover:opacity-80
                          "
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "16px",
                      border:
                        "1px solid #ece9f3",
                      background:
                        "rgba(255,255,255,0.97)",
                      boxShadow:
                        "0 20px 50px rgba(17,24,39,0.12)",
                      padding: "11px 13px",
                      backdropFilter:
                        "blur(12px)",
                    }}
                    labelStyle={{
                      color: "#111827",
                      fontSize: "10px",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                    itemStyle={{
                      color: "#7c3aed",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                    formatter={(value) =>
                      formatCurrency(
                        Number(value ?? 0)
                      )
                    }
                  />

                </PieChart>

              </ResponsiveContainer>

              {/* =================================================
                  CENTER
              ================================================== */}

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-500">

                    <Sparkles size={13} />

                  </div>

                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                    Total spent
                  </p>

                  <p className="mt-1 text-[25px] font-black tracking-[-0.04em] text-gray-950">
                    {formatCurrency(total)}
                  </p>

                  <div className="mx-auto mt-1.5 flex items-center justify-center gap-1 text-[8px] font-bold uppercase tracking-wider text-gray-400">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500" />

                    Current month

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                TOP CATEGORY INSIGHT
            ================================================== */}

            {topCategory && (
              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-purple-100
                  bg-purple-50/50
                  px-3.5
                  py-3
                  transition-all
                  duration-300
                  hover:bg-purple-50
                "
              >

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">

                  <ArrowUpRight size={15} />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-purple-400">
                    Biggest category
                  </p>

                  <p className="truncate text-xs font-bold text-gray-700">
                    {topCategory.name}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xs font-black text-gray-900">
                    {formatCurrency(
                      Number(
                        topCategory.value || 0
                      )
                    )}
                  </p>

                  <p className="text-[9px] font-semibold text-purple-500">
                    {Number(
                      topCategory.percentage || 0
                    ).toFixed(0)}
                    %
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                CATEGORY LIST
            ================================================== */}

            <div className="mt-5">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Categories
                </p>

                <p className="text-[10px] font-semibold text-gray-400">
                  {safeData.length} total
                </p>

              </div>

              <div className="space-y-1">

                {visibleCategories.map(
                  (item, index) => (

                    <div
                      key={item.name}
                      className="
                        group/item
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        px-2
                        py-2.5
                        transition-all
                        duration-300
                        hover:bg-gray-50
                      "
                    >

                      {/* LEFT */}

                      <div className="flex min-w-0 items-center gap-3">

                        <span
                          className="
                            h-2.5
                            w-2.5
                            shrink-0
                            rounded-full
                            ring-4
                            ring-transparent
                            transition-all
                            duration-300
                            group-hover/item:ring-gray-100
                          "
                          style={{
                            backgroundColor:
                              COLORS[
                                index %
                                  COLORS.length
                              ],
                          }}
                        />

                        <span className="truncate text-xs font-semibold text-gray-700">
                          {item.name}
                        </span>

                      </div>

                      {/* RIGHT */}

                      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                        <span
                          className="
                            rounded-lg
                            bg-gray-50
                            px-2
                            py-1
                            text-[9px]
                            font-bold
                            text-gray-400
                            transition-colors
                            duration-300
                            group-hover/item:bg-purple-50
                            group-hover/item:text-purple-500
                          "
                        >
                          {Number(
                            item.percentage || 0
                          ).toFixed(0)}
                          %
                        </span>

                        <span className="text-xs font-black text-gray-900">
                          {formatCurrency(
                            Number(
                              item.value || 0
                            )
                          )}
                        </span>

                        <ArrowUpRight
                          size={12}
                          className="
                            text-gray-300
                            transition-all
                            duration-300
                            group-hover/item:-translate-y-0.5
                            group-hover/item:translate-x-0.5
                            group-hover/item:text-purple-500
                          "
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </>

        )}

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
          via-purple-200
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