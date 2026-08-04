import FadeIn from "@/components/ui/FadeIn";
import { Rocket } from "lucide-react";
import Button from "@/components/ui/Button";
export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-200 opacity-40 blur-3xl"></div>

            <div className="absolute top-60 right-0 h-80 w-80 rounded-full bg-indigo-100 opacity-40 blur-3xl"></div>

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-start gap-16 px-6 pt-8 md:min-h-[50vh] lg:min-h-[85vh] lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:pt-12">
                <FadeIn>
                    {/* Left Side */}
                    <div className="w-full max-w-xl text-center lg:max-w-2xl lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                            <Rocket className="h-4 w-4" />
                            AI Powered Personal Finance
                        </span>

                        <h1 className="mt-8 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Smart Finance.
                            <br />
                            Smarter Decisions.
                        </h1>

                        <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-gray-600 lg:mx-0 lg:text-xl">
                            Finora helps salaried professionals make smarter financial decisions
                            using AI. Know before you spend.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <Button>
                                Get Started Free
                            </Button>

                            <Button variant="secondary">
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </FadeIn>


                {/* Right Side */}
                <FadeIn delay={0.2}>
                    <div className="hidden lg:flex">
                        <div className="w-full max-w-[430px] rounded-3xl border border-gray-200 bg-white p-7 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Monthly Surplus
                                    </p>

                                    <h2 className="mt-1 text-4xl font-bold text-gray-900">
                                        ₹38,500
                                    </h2>
                                </div>

                                <div className="rounded-2xl bg-green-100 px-5 py-3 text-lg font-bold text-green-700">
                                    +12%
                                </div>
                            </div>

                            <div className="relative mt-2 h-3 w-full rounded-full bg-gray-200">

                                <div className="h-3 w-[68%] rounded-full bg-gradient-to-r from-purple-600 to-violet-500"></div>

                                <div className="absolute left-[68%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-purple-600 shadow"></div>

                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                68% of your monthly savings goal completed
                            </p>

                            <div className="mt-10 grid grid-cols-3 gap-5">

                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-xs font-medium text-gray-500">
                                        Income
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                                        ₹75K
                                    </h3>

                                    <p className="mt-2 text-xs font-semibold text-green-600">
                                        +5% this month
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-xs font-medium text-gray-500">
                                        Expenses
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                                        ₹36K
                                    </h3>

                                    <p className="mt-2 text-xs font-semibold text-red-500">
                                        -2% this month
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-xs font-medium text-gray-500">
                                        Savings
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                                        ₹20K
                                    </h3>

                                    <p className="mt-2 text-xs font-semibold text-purple-600">
                                        +12% this month
                                    </p>
                                </div>

                            </div>

                            <div className="mt-8 rounded-3xl bg-gradient-to-r from-purple-600 to-violet-600 p-6 text-white shadow-xl">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm opacity-80">
                                            🤖 Finora AI
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold">
                                            Recommendation
                                        </h3>
                                    </div>

                                    <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                                        LIVE
                                    </div>

                                </div>

                                <p className="mt-6 leading-8">
                                    You can safely purchase the ₹15,000 phone next month without affecting your monthly savings goal.
                                </p>

                                <div className="mt-6">

                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>Confidence</span>
                                        <span>92%</span>
                                    </div>

                                    <div className="h-2 w-full rounded-full bg-white/20">
                                        <div className="h-2 w-[92%] rounded-full bg-white"></div>
                                    </div>

                                </div>

                                <div className="mt-6 flex items-center gap-2 text-sm font-medium">

                                    <div className="h-3 w-3 rounded-full bg-green-300"></div>

                                    Financially Safe

                                </div>

                            </div>
                        </div>

                    </div>
                </FadeIn>
            </div>
        </section >
    );
}