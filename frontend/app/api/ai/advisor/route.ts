import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function clamp(
    value: number,
    min: number,
    max: number
) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}

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

        const currentYear =
            now.getFullYear();

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
                            budgetAmount >
                            0
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
         * =====================================================
         * DETERMINISTIC FINANCIAL ANALYSIS
         *
         * No Gemini request here.
         * This means the financial analysis remains available
         * even when Gemini quota is exhausted.
         * =====================================================
         */

        const overBudgetCount =
            budgetAnalysis.filter(
                (budget) =>
                    budget.overBudget
            ).length;

        const budgetCount =
            budgetAnalysis.length;

        const averageGoalProgress =
            savingsAnalysis.length > 0
                ? savingsAnalysis.reduce(
                      (
                          total,
                          goal
                      ) =>
                          total +
                          goal.progress,
                      0
                  ) /
                  savingsAnalysis.length
                : 0;

        /*
         * Health score
         *
         * Cash flow:       30 points
         * Savings rate:    30 points
         * Budget control:  25 points
         * Savings goals:   15 points
         */
        const cashFlowScore =
            netCashFlow > 0
                ? 30
                : netCashFlow === 0
                    ? 15
                    : 0;

        const savingsScore =
            clamp(
                savingsRate * 1.5,
                0,
                30
            );

        const budgetScore =
            budgetCount === 0
                ? 15
                : clamp(
                      25 -
                          overBudgetCount *
                              8,
                      0,
                      25
                  );

        const goalScore =
            savingsAnalysis.length === 0
                ? 7.5
                : clamp(
                      averageGoalProgress *
                          0.15,
                      0,
                      15
                  );

        const healthScore = Math.round(
            clamp(
                cashFlowScore +
                    savingsScore +
                    budgetScore +
                    goalScore,
                0,
                100
            )
        );

        /*
         * Health summary
         */
        let healthSummary =
            "Your financial data is still developing. Add more income, expense, budget and savings information for a more meaningful analysis.";

        if (
            totalIncome > 0 &&
            netCashFlow > 0 &&
            savingsRate >= 20
        ) {
            healthSummary =
                "Your current cash flow is positive and your savings rate is strong. Continue controlling discretionary spending and stay consistent with your savings goals.";
        } else if (
            totalIncome > 0 &&
            netCashFlow > 0
        ) {
            healthSummary =
                "You currently have positive cash flow, which is a good foundation. Your next priority should be increasing the amount you consistently save.";
        } else if (
            totalIncome > 0 &&
            netCashFlow <= 0
        ) {
            healthSummary =
                "Your current expenses are consuming all or more than your income. Your highest priority should be reducing unnecessary spending and restoring positive monthly cash flow.";
        }

        /*
         * Key observations
         */
        const keyObservations: string[] =
            [];

        if (totalIncome > 0) {
            keyObservations.push(
                `You received ${formatCurrency(
                    totalIncome
                )} in income this month.`
            );
        }

        if (totalExpenses > 0) {
            keyObservations.push(
                `You spent ${formatCurrency(
                    totalExpenses
                )} this month.`
            );
        }

        if (
            spendingByCategory.length >
            0
        ) {
            const topCategory =
                spendingByCategory[0];

            keyObservations.push(
                `${topCategory.category} is your largest spending category at ${formatCurrency(
                    topCategory.amount
                )}.`
            );
        }

        if (totalIncome > 0) {
            keyObservations.push(
                `Your current savings rate is ${savingsRate.toFixed(
                    1
                )}%.`
            );
        }

        if (budgetCount > 0) {
            keyObservations.push(
                `${overBudgetCount} of ${budgetCount} current budgets are over budget.`
            );
        }

        if (
            savingsAnalysis.length >
            0
        ) {
            keyObservations.push(
                `You currently have ${savingsAnalysis.length} active savings goal${
                    savingsAnalysis.length ===
                    1
                        ? ""
                        : "s"
                }.`
            );
        }

        /*
         * Warnings
         */
        const warnings: string[] =
            [];

        if (
            totalIncome > 0 &&
            netCashFlow < 0
        ) {
            warnings.push(
                `Your expenses exceed your income by ${formatCurrency(
                    Math.abs(
                        netCashFlow
                    )
                )} this month.`
            );
        }

        if (
            totalIncome > 0 &&
            savingsRate >= 0 &&
            savingsRate < 10
        ) {
            warnings.push(
                "Your current savings rate is below 10%. Try to create a consistent savings buffer."
            );
        }

        budgetAnalysis
            .filter(
                (budget) =>
                    budget.overBudget
            )
            .slice(0, 3)
            .forEach((budget) => {
                warnings.push(
                    `${budget.category} is over budget by ${formatCurrency(
                        Math.abs(
                            budget.remaining
                        )
                    )}.`
                );
            });

        if (
            totalIncome === 0 &&
            totalExpenses > 0
        ) {
            warnings.push(
                "You have recorded expenses this month but no income. Make sure your income records are up to date."
            );
        }

        /*
         * Savings advice
         */
        let savingsAdvice =
            "Start by setting a realistic savings goal and recording your income and expenses consistently.";

        if (
            totalIncome > 0 &&
            savingsRate >= 20
        ) {
            savingsAdvice =
                "Your savings rate is strong. Protect this habit by automating savings and keeping lifestyle spending under control.";
        } else if (
            totalIncome > 0 &&
            savingsRate >= 10
        ) {
            savingsAdvice =
                "You are saving something each month. Try gradually increasing your savings rate toward 20% without creating unrealistic restrictions.";
        } else if (
            totalIncome > 0 &&
            savingsRate >= 0
        ) {
            savingsAdvice =
                "You have positive cash flow, but your savings rate is low. Identify your largest discretionary expense and redirect part of it toward savings.";
        } else if (
            totalIncome > 0
        ) {
            savingsAdvice =
                "Focus on restoring positive cash flow first. Once your expenses are consistently below your income, build a small emergency buffer.";
        }

        /*
         * Action plan
         */
        const actionPlan: string[] =
            [];

        if (
            netCashFlow <= 0 &&
            totalIncome > 0
        ) {
            actionPlan.push(
                "Reduce unnecessary spending until your monthly cash flow becomes positive."
            );
        }

        if (
            spendingByCategory.length >
            0
        ) {
            actionPlan.push(
                `Review your ${spendingByCategory[0].category} spending because it is currently your largest expense category.`
            );
        }

        if (
            overBudgetCount > 0
        ) {
            actionPlan.push(
                "Review your over-budget categories before making additional discretionary purchases."
            );
        }

        if (
            totalIncome > 0 &&
            savingsRate < 20
        ) {
            actionPlan.push(
                "Set aside a fixed amount immediately after receiving income instead of saving only what remains."
            );
        }

        if (
            savingsAnalysis.length === 0
        ) {
            actionPlan.push(
                "Create your first savings goal so you have a measurable target."
            );
        }

        if (actionPlan.length === 0) {
            actionPlan.push(
                "Keep your current spending and savings habits consistent."
            );

            actionPlan.push(
                "Review your financial progress at the end of each month."
            );
        }

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
         * Financial insights
         *
         * These are calculated locally.
         * Gemini is NOT required.
         */
        const insights = {
            healthScore,

            healthSummary,

            keyObservations,

            warnings,

            savingsAdvice,

            actionPlan,
        };

        return NextResponse.json({
            success: true,

            context: financialContext,

            insights,
        });
    } catch (error) {
        console.error(
            "AI Advisor Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load your financial analysis right now.",
            },
            { status: 500 }
        );
    }
}

function formatCurrency(
    value: number
) {
    return `₹${Number(value).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 0,
        }
    )}`;
}