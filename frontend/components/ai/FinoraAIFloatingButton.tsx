"use client";

import Link from "next/link";
import { Bot, Sparkles } from "lucide-react";

export default function FinoraAIFloatingButton() {
    return (
        <Link
            href="/ai#ai-chat"
            aria-label="Open Finora AI"
            className="
                group
                fixed
                bottom-6
                right-6
                z-[60]
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-purple-600
                text-white
                shadow-lg
                shadow-purple-600/30
                transition-all
                duration-300
                hover:scale-110
                hover:bg-purple-700
                hover:shadow-xl
                hover:shadow-purple-600/40
                sm:bottom-7
                sm:right-7
            "
        >
            <Bot
                size={25}
                strokeWidth={2}
            />

            {/* Hover label */}
            <span
                className="
                    pointer-events-none
                    absolute
                    right-[calc(100%+10px)]
                    whitespace-nowrap
                    rounded-lg
                    bg-gray-900
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    opacity-0
                    translate-x-2
                    transition-all
                    duration-200
                    group-hover:translate-x-0
                    group-hover:opacity-100
                "
            >
                Finora AI

                <span
                    className="
                        absolute
                        right-[-4px]
                        top-1/2
                        h-2
                        w-2
                        -translate-y-1/2
                        rotate-45
                        bg-gray-900
                    "
                />
            </span>

            {/* Small AI indicator */}
            <span
                className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-purple-600
                    shadow-sm
                "
            >
                <Sparkles size={9} />
            </span>
        </Link>
    );
}