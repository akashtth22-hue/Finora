"use client";

import {
    Activity,
    ArrowUpRight,
    BarChart3,
    CircleDollarSign,
    TrendingUp,
} from "lucide-react";

const particles = [
    { left: "8%", top: "22%", delay: "0s", duration: "7s" },
    { left: "18%", top: "70%", delay: "1.5s", duration: "9s" },
    { left: "31%", top: "35%", delay: "3s", duration: "8s" },
    { left: "48%", top: "18%", delay: "0.8s", duration: "10s" },
    { left: "64%", top: "75%", delay: "2.2s", duration: "8s" },
    { left: "76%", top: "30%", delay: "4s", duration: "9s" },
    { left: "88%", top: "62%", delay: "1s", duration: "7s" },
    { left: "94%", top: "18%", delay: "3.5s", duration: "11s" },
];

export default function FinoraBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* =================================================
                AMBIENT LIGHT
            ================================================= */}

            <div className="absolute left-1/2 top-[12%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-400/[0.08] blur-[120px] animate-[orbPulse_9s_ease-in-out_infinite]" />

            <div
                className="absolute -left-[180px] top-[35%] h-[480px] w-[480px] rounded-full bg-violet-400/[0.07] blur-[120px] animate-[orbFloat_13s_ease-in-out_infinite]"
            />

            <div
                className="absolute -right-[180px] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-400/[0.07] blur-[120px] animate-[orbFloatReverse_15s_ease-in-out_infinite]"
            />

            {/* =================================================
                PREMIUM GRID
            ================================================= */}

            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(76,29,149,1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,29,149,1) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                }}
            />

            {/* =================================================
                MOVING LIGHT
            ================================================= */}

            <div className="absolute -left-[20%] top-[20%] h-px w-[140%] rotate-[18deg] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-[lightSweep_12s_linear_infinite]" />

            <div
                className="absolute -left-[20%] top-[65%] h-px w-[140%] -rotate-[12deg] bg-gradient-to-r from-transparent via-indigo-400/15 to-transparent animate-[lightSweep_16s_linear_infinite]"
                style={{
                    animationDelay: "4s",
                }}
            />

            {/* =================================================
                PARTICLES
            ================================================= */}

            {particles.map((particle, index) => (
                <span
                    key={index}
                    className="absolute h-1 w-1 rounded-full bg-purple-500/30 shadow-[0_0_12px_3px_rgba(124,58,237,0.12)] animate-[particleFloat_ease-in-out_infinite]"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        animationDelay: particle.delay,
                        animationDuration: particle.duration,
                    }}
                />
            ))}

            {/* =================================================
                FLOATING FINANCIAL SIGNALS
            ================================================= */}

            <div className="absolute left-[7%] top-[42%] hidden animate-[signalFloat_8s_ease-in-out_infinite] lg:block">
                <FinancialSignal
                    icon={<TrendingUp size={13} />}
                    text="+12.8%"
                />
            </div>

            <div
                className="absolute right-[8%] top-[48%] hidden animate-[signalFloat_10s_ease-in-out_infinite] lg:block"
                style={{
                    animationDelay: "2s",
                }}
            >
                <FinancialSignal
                    icon={<CircleDollarSign size={13} />}
                    text="₹38.5K"
                />
            </div>

            <div
                className="absolute bottom-[18%] left-[17%] hidden animate-[signalFloat_11s_ease-in-out_infinite] lg:block"
                style={{
                    animationDelay: "4s",
                }}
            >
                <FinancialSignal
                    icon={<Activity size={13} />}
                    text="Healthy"
                />
            </div>

            <div
                className="absolute bottom-[22%] right-[18%] hidden animate-[signalFloat_9s_ease-in-out_infinite] lg:block"
                style={{
                    animationDelay: "1s",
                }}
            >
                <FinancialSignal
                    icon={<BarChart3 size={13} />}
                    text="+5.2%"
                />
            </div>

            {/* =================================================
                SOFT VIGNETTE
            ================================================= */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(255,255,255,0.35)_100%)]" />

            {/* =================================================
                KEYFRAMES
            ================================================= */}

            <style jsx>{`
                @keyframes orbPulse {
                    0%,
                    100% {
                        transform: translateX(-50%) scale(1);
                        opacity: 0.65;
                    }

                    50% {
                        transform: translateX(-50%) scale(1.12);
                        opacity: 1;
                    }
                }

                @keyframes orbFloat {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }

                    50% {
                        transform: translate3d(45px, -30px, 0);
                    }
                }

                @keyframes orbFloatReverse {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }

                    50% {
                        transform: translate3d(-40px, 35px, 0);
                    }
                }

                @keyframes lightSweep {
                    0% {
                        transform: translateX(-35%) rotate(18deg);
                        opacity: 0;
                    }

                    15% {
                        opacity: 1;
                    }

                    75% {
                        opacity: 0.8;
                    }

                    100% {
                        transform: translateX(35%) rotate(18deg);
                        opacity: 0;
                    }
                }

                @keyframes particleFloat {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0) scale(1);
                        opacity: 0.25;
                    }

                    50% {
                        transform: translate3d(0, -24px, 0) scale(1.6);
                        opacity: 0.75;
                    }
                }

                @keyframes signalFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-12px);
                    }
                }
            `}</style>
        </div>
    );
}

function FinancialSignal({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-purple-100/70 bg-white/65 px-3 py-2 text-[10px] font-bold text-gray-500 shadow-lg shadow-purple-900/[0.04] backdrop-blur-md">
            <span className="text-purple-600">
                {icon}
            </span>

            {text}

            <ArrowUpRight
                size={11}
                className="text-green-500"
            />
        </div>
    );
}