"use client";

import {
  LucideIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
}: StatCardProps) {
  return (
    <article
      className="
        group
        relative
        z-0
        isolate
        w-full
        overflow-hidden
        rounded-[22px]
        border
        border-gray-200/80
        bg-white
        px-4
        py-4
        shadow-[0_8px_30px_rgba(20,15,40,0.04)]
        transition-all
        duration-300
        ease-out
        hover:z-50
        hover:-translate-y-1
        hover:border-purple-100
        hover:shadow-[0_18px_45px_rgba(91,33,182,0.09)]
        sm:px-5
        sm:py-4
      "
    >
      {/* Ambient glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-purple-500/[0.055]
          blur-3xl
          transition-all
          duration-700
          group-hover:scale-125
          group-hover:bg-purple-500/[0.09]
        "
      />

      {/* Top accent */}

      <div
        className="
          pointer-events-none
          absolute
          left-6
          right-6
          top-0
          h-[2px]
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-purple-400/60
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-1.5">

              <span
                className="
                  truncate
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-gray-400
                "
              >
                {title}
              </span>

              <span
                className="
                  h-1.5
                  w-1.5
                  shrink-0
                  rounded-full
                  bg-gray-200
                  transition-all
                  duration-300
                  group-hover:scale-125
                  group-hover:bg-purple-400
                "
              />

            </div>

            <h2
              className="
                mt-2
                truncate
                text-[23px]
                font-black
                tracking-[-0.04em]
                text-gray-950
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                sm:text-[25px]
              "
            >
              {value}
            </h2>

          </div>

          {/* ICON */}

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
              border-purple-100
              bg-gradient-to-br
              from-purple-50
              via-violet-50
              to-indigo-100/70
              text-purple-600
              shadow-sm
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:rotate-2
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-xl
                bg-purple-400/15
                opacity-0
                blur-md
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            <Icon
              className="relative z-10"
              size={19}
              strokeWidth={2.2}
            />

          </div>

        </div>

        {/* FOOTER */}

        <div className="mt-4 flex items-center justify-between gap-2">

          <div
            className={`
              inline-flex
              min-w-0
              items-center
              gap-1
              rounded-full
              border
              px-2
              py-1
              ${
                positive
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-red-100 bg-red-50"
              }
            `}
          >

            {positive ? (
              <ArrowUpRight
                size={11}
                strokeWidth={2.5}
                className="shrink-0 text-emerald-600"
              />
            ) : (
              <ArrowDownRight
                size={11}
                strokeWidth={2.5}
                className="shrink-0 text-red-500"
              />
            )}

            <span
              className={`
                truncate
                text-[10px]
                font-bold
                ${
                  positive
                    ? "text-emerald-600"
                    : "text-red-500"
                }
              `}
            >
              {change}
            </span>

          </div>

          <span
            className="
              hidden
              text-[8px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-gray-300
              transition-colors
              duration-300
              group-hover:text-purple-300
              sm:block
            "
          >
            Monthly
          </span>

        </div>

      </div>

      {/* Bottom light */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-6
          right-6
          h-px
          bg-gradient-to-r
          from-transparent
          via-purple-200
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

    </article>
  );
}