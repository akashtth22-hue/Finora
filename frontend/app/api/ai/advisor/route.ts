import { GoogleGenAI } from "@google/genai";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Gemini API key is not configured.",
                },
                { status: 500 }
            );
        }

        /*
         * Get user's financial data
         */
        const transactions =
            await prisma.transaction.findMany({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    date: "desc",
                },
            });

        const budgets =
            await prisma.budget.findMany({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    month: "desc",
                },
            });

        const savingsGoals =
            await prisma.savingsGoal.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    entries: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        /*
         * Current month
         */
        const now = new Date();

        const currentYear = now.getFullYear();

        const currentMonth =
            now.getMonth();

        const currentMonthTransactions =
            transactions.filter(
                (transaction) => {
                    const date = new Date(
                        transaction.date
                    );

                    return (
                        date.getFullYear() ===
                        currentYear &&
                        date.getMonth() ===
                        currentMonth
                    );
                }
            );

        /*
         * Income
         */
        const totalIncome =
            currentMonthTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "INCOME"
                )
                .reduce(
                    (total, transaction) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        /*
         * Expenses
         */
        const totalExpenses =
            currentMonthTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "EXPENSE"
                )
                .reduce(
                    (total, transaction) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        /*
         * Cash flow
         */
        const netCashFlow =
            totalIncome -
            totalExpenses;

        /*
         * Savings rate
         */
        const savingsRate =
            totalIncome > 0
                ? (netCashFlow /
                    totalIncome) *
                100
                : 0;

        /*
         * Spending by category
         */
        const categoryMap: Record<
            string,
            number
        > = {};

        currentMonthTransactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    "EXPENSE"
            )
            .forEach((transaction) => {
                const category =
                    transaction.category;

                categoryMap[category] =
                    (categoryMap[category] ||
                        0) +
                    Number(
                        transaction.amount
                    );
            });

        const spendingByCategory =
            Object.entries(categoryMap)
                .map(
                    ([
                        category,
                        amount,
                    ]) => ({
                        category,
                        amount,
                    })
                )
                .sort(
                    (a, b) =>
                        b.amount -
                        a.amount
                );

        /*
         * Current month budgets
         */
        const currentBudgets =
            budgets.filter((budget) => {
                const date = new Date(
                    budget.month
                );

                return (
                    date.getFullYear() ===
                    currentYear &&
                    date.getMonth() ===
                    currentMonth
                );
            });

        const budgetAnalysis =
            currentBudgets.map(
                (budget) => {
                    const spent =
                        categoryMap[
                        budget.category
                        ] || 0;

                    const budgetAmount =
                        Number(
                            budget.amount
                        );

                    const remaining =
                        budgetAmount -
                        spent;

                    return {
                        category:
                            budget.category,

                        budget:
                            budgetAmount,

                        spent,

                        remaining,

                        overBudget:
                            remaining < 0,

                        percentageUsed:
                            budgetAmount > 0
                                ? (spent /
                                    budgetAmount) *
                                100
                                : 0,
                    };
                }
            );

        /*
         * Savings goals
         */
        const savingsAnalysis =
            savingsGoals.map((goal) => {
                const deposited =
                    goal.entries
                        .filter(
                            (entry) =>
                                entry.type ===
                                "DEPOSIT"
                        )
                        .reduce(
                            (
                                total,
                                entry
                            ) =>
                                total +
                                Number(
                                    entry.amount
                                ),
                            0
                        );

                const withdrawn =
                    goal.entries
                        .filter(
                            (entry) =>
                                entry.type ===
                                "WITHDRAWAL"
                        )
                        .reduce(
                            (
                                total,
                                entry
                            ) =>
                                total +
                                Number(
                                    entry.amount
                                ),
                            0
                        );

                const currentSaved =
                    deposited -
                    withdrawn;

                const targetAmount =
                    Number(
                        goal.targetAmount
                    );

                const remaining =
                    Math.max(
                        targetAmount -
                        currentSaved,
                        0
                    );

                const progress =
                    targetAmount > 0
                        ? (currentSaved /
                            targetAmount) *
                        100
                        : 0;

                return {
                    name: goal.name,

                    targetAmount,

                    currentSaved,

                    remaining,

                    progress,

                    deadline:
                        goal.deadline,
                };
            });

        /*
         * Structured financial context
         */
        const financialContext = {
            currentMonth: `${currentYear}-${String(
                currentMonth + 1
            ).padStart(2, "0")}`,

            income: totalIncome,

            expenses: totalExpenses,

            netCashFlow,

            savingsRate,

            spendingByCategory,

            budgets: budgetAnalysis,

            savingsGoals:
                savingsAnalysis,
        };

        /*
         * AI prompt
         */
        const prompt = `
You are Finora AI, a personal finance advisor.

Analyze the user's financial data below.

Your job is to provide practical, clear and responsible
financial guidance.

IMPORTANT RULES:

1. Use ONLY the financial data provided below.
2. Never invent transactions, income, expenses, budgets,
   savings goals or financial numbers.
3. Do not claim certainty about the user's future.
4. Do not recommend specific stocks, cryptocurrencies,
   securities or high-risk investments.
5. Focus on budgeting, spending behavior, saving,
   cash-flow management and financial habits.
6. If there is insufficient data, clearly say so.
7. Keep the advice concise and actionable.
8. Use Indian Rupee formatting when mentioning money.
9. Do not expose private implementation details,
   database information or API information.

Analyze:

- Overall financial health
- Spending behavior
- Budget problems
- Savings progress
- The most important actions the user should take

Return ONLY valid JSON matching the requested structure.

FINANCIAL DATA:

${JSON.stringify(financialContext, null, 2)}
`;

        /*
         * Gemini
         */
        const response =
            await ai.models.generateContent({
                model: "gemini-3.6-flash",

                contents: prompt,

                config: {
                    responseMimeType:
                        "application/json",

                    responseSchema: {
                        type: "object",

                        properties: {
                            healthScore: {
                                type: "number",
                            },

                            healthSummary: {
                                type: "string",
                            },

                            keyObservations: {
                                type: "array",

                                items: {
                                    type: "string",
                                },
                            },

                            warnings: {
                                type: "array",

                                items: {
                                    type: "string",
                                },
                            },

                            savingsAdvice: {
                                type: "string",
                            },

                            actionPlan: {
                                type: "array",

                                items: {
                                    type: "string",
                                },
                            },
                        },

                        required: [
                            "healthScore",
                            "healthSummary",
                            "keyObservations",
                            "warnings",
                            "savingsAdvice",
                            "actionPlan",
                        ],
                    },
                },
            });

        const aiText = response.text;

        if (!aiText) {
            throw new Error(
                "Gemini returned an empty response."
            );
        }

        let aiInsights;

        try {
            aiInsights =
                JSON.parse(aiText);
        } catch {
            console.error(
                "Invalid Gemini JSON:",
                aiText
            );

            throw new Error(
                "Gemini returned invalid JSON."
            );
        }

        /*
         * Final response
         */
        return NextResponse.json({
            success: true,

            context: financialContext,

            insights: aiInsights,
        });
    } catch (error) {
        console.error("AI Advisor Error:", error);

        return NextResponse.json(
            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to generate AI financial insights right now.",
            },
            { status: 500 }
        );
    }
}