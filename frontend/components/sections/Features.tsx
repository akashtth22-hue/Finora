import FadeIn from "@/components/ui/FadeIn";
import {
    Brain,
    Wallet,
    ChartColumn,
    MessageSquare,
} from "lucide-react";
export default function Features() {
    return (
        <section className="bg-gray-50 py-24">
            <div className="mx-auto max-w-7xl px-8">

                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">
                        Everything You Need to Make Smarter Financial Decisions
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
                        Finora combines AI with your financial profile to help you
                        spend smarter, save better, and plan confidently.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    <FadeIn delay={0.1}>
                        <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
                                <Brain className="h-7 w-7 text-purple-600" />
                            </div>

                            <h3 className="text-2xl font-semibold">
                                AI Decision Assistant
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Ask financial questions and receive personalized answers
                                based on your own financial profile.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                                <Wallet className="h-7 w-7 text-green-600" />
                            </div>

                            <h3 className="text-2xl font-semibold">
                                Financial Profile
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Securely manage your income, expenses, savings,
                                and monthly financial overview.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                <ChartColumn className="h-7 w-7 text-blue-600" />
                            </div>

                            <h3 className="text-2xl font-semibold">
                                Monthly Surplus
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Instantly know how much money you can safely spend
                                every month.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                                <MessageSquare className="h-7 w-7 text-orange-600" />
                            </div>

                            <h3 className="text-2xl font-semibold">
                                Conversation History
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Review your previous AI financial conversations
                                whenever you need them.
                            </p>
                        </div>
                    </FadeIn>

                </div>

            </div>
        </section>
    );
}