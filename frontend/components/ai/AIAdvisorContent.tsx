"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Brain,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    Target,
    RefreshCw,
    Send,
    User,
    Sparkles,
} from "lucide-react";
import { FormEvent, useRef, useEffect, useState } from "react";

type AIInsights = {
    healthScore: number;
    healthSummary: string;
    keyObservations: string[];
    warnings: string[];
    savingsAdvice: string;
    actionPlan: string[];
};

type AIResponse = {
    success: boolean;
    context: {
        currentMonth: string;
        income: number;
        expenses: number;
        netCashFlow: number;
        savingsRate: number;
    };
    insights: AIInsights;
};

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const DAILY_AI_LIMIT = 20;

function formatCurrency(value: number) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function AIAdvisorContent() {
    const [messages, setMessages] = useState<
        ChatMessage[]
    >([]);

    const [message, setMessage] = useState("");

    const [isSending, setIsSending] =
        useState(false);

    const [questionsRemaining, setQuestionsRemaining] =
        useState<number>(DAILY_AI_LIMIT);

    const chatEndRef =
        useRef<HTMLDivElement | null>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery<AIResponse>({
        queryKey: ["ai-advisor"],

        queryFn: async () => {
            const response = await fetch(
                "/api/ai/advisor",
                {
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Failed to load AI Advisor"
                );
            }

            return result;
        },

        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    async function sendMessage(
        event?: FormEvent,
        predefinedMessage?: string
    ) {
        event?.preventDefault();

        const userMessage = (
            predefinedMessage ?? message
        ).trim();

        if (
            !userMessage ||
            isSending ||
            questionsRemaining <= 0
        ) {
            return;
        }

        const userChatMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: userMessage,
        };

        setMessages((previous) => [
            ...previous,
            userChatMessage,
        ]);

        setMessage("");
        setIsSending(true);

        try {
            const response = await fetch(
                "/api/ai/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        message: userMessage,
                    }),
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                if (
                    result.limitReached ===
                    true
                ) {
                    setQuestionsRemaining(0);
                }

                throw new Error(
                    result.message ||
                        "Unable to get AI response."
                );
            }

            /*
             * Update remaining questions
             */
            if (result.usage) {
                setQuestionsRemaining(
                    result.usage.questionsRemaining
                );
            }

            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: result.answer,
            };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);
        } catch (error) {
            console.error(
                "Chat error:",
                error
            );

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unable to process your question.";

            if (
                errorMessage
                    .toLowerCase()
                    .includes("daily limit")
            ) {
                setQuestionsRemaining(0);
            }

            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: errorMessage,
            };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);
        } finally {
            setIsSending(false);
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        AI Advisor
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your personal financial assistant.
                    </p>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white py-20 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                        <Brain size={28} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Analyzing your finances...
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Finora AI is reviewing your
                        spending, budgets and savings.
                    </p>

                </div>

            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        AI Advisor
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your personal financial assistant.
                    </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <AlertTriangle size={24} />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-red-700">
                        Unable to load AI Advisor
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        Something went wrong while
                        analyzing your financial data.
                    </p>

                    <button
                        onClick={() =>
                            refetch()
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    const insights = data.insights;

    const healthScore = Math.max(
        0,
        Math.min(
            100,
            Number(
                insights.healthScore
            ) || 0
        )
    );

    const scoreMessage =
        healthScore >= 80
            ? "Excellent financial health"
            : healthScore >= 60
                ? "Good financial health"
                : healthScore >= 40
                    ? "Needs some attention"
                    : "Needs immediate attention";

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Brain size={23} />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            AI Advisor
                        </h1>

                    </div>

                    <p className="mt-2 text-gray-500">
                        Personalized financial guidance
                        based on your Finora data.
                    </p>
                </div>

                <button
                    onClick={() =>
                        refetch()
                    }
                    disabled={isFetching}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                    <RefreshCw
                        size={17}
                        className={
                            isFetching
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {isFetching
                        ? "Analyzing..."
                        : "Refresh Analysis"}
                </button>

            </div>

            {/* AI Health Overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

                {/* Score */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="text-center">

                        <p className="text-sm font-medium text-gray-500">
                            Financial Health
                        </p>

                        <div className="relative mx-auto mt-5 flex h-40 w-40 items-center justify-center">

                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background:
                                        `conic-gradient(#7c3aed ${healthScore * 3.6}deg, #f3f4f6 0deg)`,
                                }}
                            />

                            <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-white">

                                <span className="text-4xl font-bold text-gray-900">
                                    {Math.round(
                                        healthScore
                                    )}
                                </span>

                                <span className="text-sm text-gray-400">
                                    / 100
                                </span>

                            </div>

                        </div>

                        <h2 className="mt-5 text-lg font-bold text-gray-900">
                            {scoreMessage}
                        </h2>

                    </div>

                </div>

                {/* Summary */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Brain size={20} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900">
                                Finora's Assessment
                            </h2>

                            <p className="text-xs text-gray-400">
                                Based on your current financial data
                            </p>
                        </div>

                    </div>

                    <p className="mt-6 text-base leading-7 text-gray-600">
                        {insights.healthSummary}
                    </p>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Income
                            </p>

                            <p className="mt-1 font-bold text-green-600">
                                {formatCurrency(
                                    data.context
                                        .income
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Expenses
                            </p>

                            <p className="mt-1 font-bold text-red-500">
                                {formatCurrency(
                                    data.context
                                        .expenses
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Savings Rate
                            </p>

                            <p className="mt-1 font-bold text-purple-600">
                                {Number(
                                    data.context
                                        .savingsRate
                                ).toFixed(1)}
                                %
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Key Observations */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Lightbulb size={20} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Key Insights
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            What Finora AI noticed about
                            your finances.
                        </p>
                    </div>

                </div>

                {insights.keyObservations.length === 0 ? (
                    <p className="mt-6 text-sm text-gray-500">
                        Not enough data to generate
                        observations yet.
                    </p>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">

                        {insights.keyObservations.map(
                            (
                                observation,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-3 rounded-xl bg-gray-50 p-4"
                                >

                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600">
                                        {index + 1}
                                    </div>

                                    <p className="text-sm leading-6 text-gray-700">
                                        {observation}
                                    </p>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* Warnings + Savings Advice */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Warnings */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Attention Needed
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Areas that may need your
                                attention.
                            </p>
                        </div>

                    </div>

                    {insights.warnings.length === 0 ? (
                        <div className="mt-6 flex items-center gap-3 rounded-xl bg-green-50 p-4">

                            <CheckCircle2
                                size={20}
                                className="shrink-0 text-green-600"
                            />

                            <p className="text-sm font-medium text-green-700">
                                No major financial
                                warnings right now.
                            </p>

                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">

                            {insights.warnings.map(
                                (
                                    warning,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 rounded-xl bg-red-50 p-4"
                                    >

                                        <AlertTriangle
                                            size={18}
                                            className="mt-0.5 shrink-0 text-red-500"
                                        />

                                        <p className="text-sm leading-6 text-red-700">
                                            {warning}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* Savings Advice */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <Target size={20} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Savings Advice
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Guidance based on your
                                savings behavior.
                            </p>
                        </div>

                    </div>

                    <div className="mt-6 rounded-xl bg-green-50 p-5">

                        <p className="text-sm leading-7 text-green-800">
                            {insights.savingsAdvice}
                        </p>

                    </div>

                </div>

            </div>

            {/* Action Plan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Your Action Plan
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            The most important steps to
                            take next.
                        </p>
                    </div>

                </div>

                {insights.actionPlan.length === 0 ? (
                    <p className="mt-6 text-sm text-gray-500">
                        No action plan is available yet.
                    </p>
                ) : (
                    <div className="mt-6 space-y-3">

                        {insights.actionPlan.map(
                            (
                                action,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 rounded-xl border border-gray-100 p-4"
                                >

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                                        {index + 1}
                                    </div>

                                    <p className="pt-1 text-sm leading-6 text-gray-700">
                                        {action}
                                    </p>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* =====================================================
                ASK FINORA
            ====================================================== */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                {/* Chat Header */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Sparkles size={22} />
                        </div>

                        <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Ask Finora
                                </h2>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        questionsRemaining === 0
                                            ? "bg-red-100 text-red-600"
                                            : questionsRemaining <= 5
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-purple-100 text-purple-600"
                                    }`}
                                >
                                    {questionsRemaining === 0
                                        ? "Daily limit reached"
                                        : `${questionsRemaining} questions left today`}
                                </span>

                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                Ask anything about your personal finances.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Chat Area */}
                <div className="min-h-[280px] max-h-[520px] overflow-y-auto px-4 py-5 sm:px-6">

                    {messages.length === 0 ? (
                        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                <Brain size={27} />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                What would you like to know?
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Finora can answer questions
                                using your actual income,
                                expenses, budgets and savings.
                            </p>

                            {/* Suggested Questions */}
                            <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">

                                {[
                                    "How can I reduce my spending?",
                                    "Am I saving enough this month?",
                                    "What is my biggest expense?",
                                    "How can I improve my budget?",
                                ].map(
                                    (
                                        question
                                    ) => (
                                        <button
                                            key={question}
                                            type="button"
                                            onClick={() =>
                                                sendMessage(
                                                    undefined,
                                                    question
                                                )
                                            }
                                            disabled={
                                                isSending ||
                                                questionsRemaining === 0
                                            }
                                            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {question}
                                        </button>
                                    )
                                )}

                            </div>

                        </div>
                    ) : (
                        <div className="space-y-5">

                            {messages.map(
                                (
                                    chatMessage
                                ) => (
                                    <div
                                        key={chatMessage.id}
                                        className={`flex gap-3 ${
                                            chatMessage.role ===
                                            "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >

                                        {chatMessage.role ===
                                            "assistant" && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                                <Sparkles
                                                    size={17}
                                                />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                                                chatMessage.role ===
                                                "user"
                                                    ? "rounded-br-md bg-purple-600 text-white"
                                                    : "rounded-bl-md bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap text-sm leading-6">
                                                {chatMessage.content}
                                            </p>
                                        </div>

                                        {chatMessage.role ===
                                            "user" && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                                                <User
                                                    size={17}
                                                />
                                            </div>
                                        )}

                                    </div>
                                )
                            )}

                            {/* AI typing indicator */}
                            {isSending && (
                                <div className="flex gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                        <Sparkles size={17} />
                                    </div>

                                    <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">

                                        <div className="flex items-center gap-1">

                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />

                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                                style={{
                                                    animationDelay:
                                                        "150ms",
                                                }}
                                            />

                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                                style={{
                                                    animationDelay:
                                                        "300ms",
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>
                            )}

                            <div ref={chatEndRef} />

                        </div>
                    )}

                </div>

                {/* Input */}
                <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-5">

                    <form
                        onSubmit={sendMessage}
                        className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100"
                    >

                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                        "Enter" &&
                                    !event.shiftKey
                                ) {
                                    event.preventDefault();

                                    sendMessage();
                                }
                            }}
                            placeholder={
                                questionsRemaining === 0
                                    ? "Daily AI limit reached"
                                    : "Ask Finora about your money..."
                            }
                            rows={1}
                            maxLength={2000}
                            disabled={
                                isSending ||
                                questionsRemaining === 0
                            }
                            className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                        />

                        <button
                            type="submit"
                            disabled={
                                !message.trim() ||
                                isSending ||
                                questionsRemaining === 0
                            }
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isSending ? (
                                <RefreshCw
                                    size={19}
                                    className="animate-spin"
                                />
                            ) : (
                                <Send size={19} />
                            )}
                        </button>

                    </form>

                    <p className="mt-2 text-center text-[11px] text-gray-400">
                        Finora AI provides general financial
                        guidance, not professional financial advice.
                    </p>

                </div>

            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">

                <p className="text-xs leading-5 text-gray-500">
                    Finora AI provides general financial
                    guidance based on the information
                    available in your account. It is not a
                    substitute for professional financial advice.
                </p>

            </div>

        </div>
    );
}