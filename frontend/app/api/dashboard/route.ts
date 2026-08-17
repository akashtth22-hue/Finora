import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =========================================================
   DATE HELPERS
========================================================= */

/**
 * Finora currently targets India.
 *
 * We normalize the check-in date to an IST calendar day so
 * "today's check-in" doesn't accidentally change around UTC
 * midnight.
 */
function getIndiaDayRange(date = new Date()) {
    const formatter = new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    );

    const parts = formatter.formatToParts(date);

    const year = Number(
        parts.find(
            (part) => part.type === "year"
        )?.value
    );

    const month = Number(
        parts.find(
            (part) => part.type === "month"
        )?.value
    );

    const day = Number(
        parts.find(
            (part) => part.type === "day"
        )?.value
    );

    /**
     * Create the corresponding UTC range for
     * the India calendar day.
     *
     * IST = UTC + 5:30
     */
    const start = new Date(
        Date.UTC(
            year,
            month - 1,
            day,
            0,
            0,
            0,
            0
        ) - 5.5 * 60 * 60 * 1000
    );

    const end = new Date(
        start.getTime() +
            24 * 60 * 60 * 1000
    );

    return {
        start,
        end,
    };
}

function getMonthRange(date = new Date()) {
    const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );

    const end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
    );

    return { start, end };
}

function getPreviousMonthRange() {
    const now = new Date();

    const start = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
    );

    const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    return { start, end };
}

function getPercentageChange(
    current: number,
    previous: number
) {
    if (previous === 0) {
        if (current === 0) return 0;

        return 100;
    }

    return (
        ((current - previous) /
            previous) *
        100
    );
}

function round(value: number) {
    return (
        Math.round(value * 100) / 100
    );
}

/* =========================================================
   GET DASHBOARD
========================================================= */

export async function GET() {
    try {
        /* =====================================================
           AUTHENTICATION
        ====================================================== */

        const user =
            await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        /* =====================================================
           DATE RANGES
        ====================================================== */

        const now = new Date();

        const {
            start: currentMonthStart,
            end: currentMonthEnd,
        } = getMonthRange(now);

        const {
            start: previousMonthStart,
            end: previousMonthEnd,
        } = getPreviousMonthRange();

        const {
            start: todayStart,
            end: todayEnd,
        } = getIndiaDayRange(now);

        /* =====================================================
           VOICE AI CHECK-IN STATUS
        ====================================================== */

        const [
            onboardingCheckIn,
            todayDailyCheckIn,
        ] = await Promise.all([
            prisma.voiceCheckIn.findFirst({
                where: {
                    userId: user.id,
                    type: "ONBOARDING",
                    status: "COMPLETED",
                },

                orderBy: {
                    completedAt: "desc",
                },
            }),

            prisma.voiceCheckIn.findFirst({
                where: {
                    userId: user.id,
                    type: "DAILY",
                    status: "COMPLETED",

                    checkInDate: {
                        gte: todayStart,
                        lt: todayEnd,
                    },
                },

                orderBy: {
                    completedAt: "desc",
                },
            }),
        ]);

        /**
         * New user logic:
         *
         * We do NOT use transaction count.
         * We do NOT use localStorage.
         *
         * If onboarding has never been completed,
         * Finora considers onboarding incomplete.
         */
        const isNewUser =
            !onboardingCheckIn;

        /**
         * Priority:
         *
         * 1. Complete onboarding first.
         * 2. Otherwise show today's daily check-in
         *    if it hasn't already been completed.
         */
        let voiceCheckInType:
            | "ONBOARDING"
            | "DAILY"
            | null = null;

        if (isNewUser) {
            voiceCheckInType =
                "ONBOARDING";
        } else if (!todayDailyCheckIn) {
            voiceCheckInType =
                "DAILY";
        }

        const shouldShowVoiceCheckIn =
            voiceCheckInType !== null;

        /* =====================================================
           FETCH FINANCIAL DATA
        ====================================================== */

        const [
            currentMonthTransactions,
            previousMonthTransactions,
            allTransactions,
            currentBudgets,
            savingsGoals,
        ] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    userId: user.id,

                    date: {
                        gte: currentMonthStart,
                        lt: currentMonthEnd,
                    },
                },

                orderBy: {
                    date: "desc",
                },
            }),

            prisma.transaction.findMany({
                where: {
                    userId: user.id,

                    date: {
                        gte: previousMonthStart,
                        lt: previousMonthEnd,
                    },
                },
            }),

            prisma.transaction.findMany({
                where: {
                    userId: user.id,
                },

                orderBy: {
                    date: "desc",
                },
            }),

            prisma.budget.findMany({
                where: {
                    userId: user.id,

                    month: {
                        gte: currentMonthStart,
                        lt: currentMonthEnd,
                    },
                },
            }),

            prisma.savingsGoal.findMany({
                where: {
                    userId: user.id,
                },

                include: {
                    entries: true,
                },

                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        /* =====================================================
           CURRENT MONTH INCOME
        ====================================================== */

        const currentIncome =
            currentMonthTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "INCOME"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        /* =====================================================
           CURRENT MONTH EXPENSE
        ====================================================== */

        const currentExpenses =
            currentMonthTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "EXPENSE"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        const currentSavings =
            currentIncome -
            currentExpenses;

        /* =====================================================
           PREVIOUS MONTH
        ====================================================== */

        const previousIncome =
            previousMonthTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "INCOME"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        const previousExpenses =
            previousMonthTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "EXPENSE"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        const previousSavings =
            previousIncome -
            previousExpenses;

        /* =====================================================
           TOTAL BALANCE
        ====================================================== */

        const totalIncome =
            allTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "INCOME"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        const totalExpenses =
            allTransactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "EXPENSE"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount
                        ),
                    0
                );

        const totalBalance =
            totalIncome -
            totalExpenses;

        /* =====================================================
           MONTHLY CHANGES
        ====================================================== */

        const incomeChange =
            getPercentageChange(
                currentIncome,
                previousIncome
            );

        const expenseChange =
            getPercentageChange(
                currentExpenses,
                previousExpenses
            );

        const savingsChange =
            getPercentageChange(
                currentSavings,
                previousSavings
            );

        /* =====================================================
           SAVINGS RATE
        ====================================================== */

        const savingsRate =
            currentIncome > 0
                ? (currentSavings /
                      currentIncome) *
                  100
                : 0;

        /* =====================================================
           EXPENSE BY CATEGORY
        ====================================================== */

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
            .forEach(
                (transaction) => {
                    const category =
                        transaction.category ||
                        "Other";

                    categoryMap[
                        category
                    ] =
                        (categoryMap[
                            category
                        ] || 0) +
                        Number(
                            transaction.amount
                        );
                }
            );

        const totalCategoryExpenses =
            Object.values(
                categoryMap
            ).reduce(
                (total, value) =>
                    total + value,
                0
            );

        const expenseByCategory =
            Object.entries(
                categoryMap
            )
                .map(
                    ([
                        category,
                        amount,
                    ]) => ({
                        name: category,

                        value: round(
                            amount
                        ),

                        percentage:
                            totalCategoryExpenses >
                            0
                                ? round(
                                      (amount /
                                          totalCategoryExpenses) *
                                          100
                                  )
                                : 0,
                    })
                )
                .sort(
                    (a, b) =>
                        b.value -
                        a.value
                );

        /* =====================================================
           RECENT TRANSACTIONS
        ====================================================== */

        const recentTransactions =
            allTransactions
                .slice(0, 6)
                .map(
                    (transaction) => ({
                        id:
                            transaction.id,

                        title:
                            transaction.description ||
                            transaction.category,

                        category:
                            transaction.category,

                        type:
                            transaction.type,

                        amount: round(
                            Number(
                                transaction.amount
                            )
                        ),

                        date:
                            transaction.date,
                    })
                );

        /* =====================================================
           BUDGET PROGRESS
        ====================================================== */

        const totalBudget =
            currentBudgets.reduce(
                (
                    total,
                    budget
                ) =>
                    total +
                    Number(
                        budget.amount
                    ),
                0
            );

        const budgetSpent =
            currentExpenses;

        const budgetRemaining =
            totalBudget -
            budgetSpent;

        const budgetUsedPercentage =
            totalBudget > 0
                ? Math.min(
                      Math.max(
                          (budgetSpent /
                              totalBudget) *
                              100,
                          0
                      ),
                      100
                  )
                : 0;

        let budgetStatus:
            | "Healthy"
            | "Warning"
            | "Exceeded" =
            "Healthy";

        if (
            totalBudget > 0 &&
            budgetSpent >
                totalBudget
        ) {
            budgetStatus =
                "Exceeded";
        } else if (
            totalBudget > 0 &&
            budgetUsedPercentage >=
                80
        ) {
            budgetStatus =
                "Warning";
        }

        /* =====================================================
           SAVINGS GOALS
        ====================================================== */

        const savingsGoalData =
            savingsGoals.map(
                (goal) => {
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

                    const target =
                        Number(
                            goal.targetAmount
                        );

                    const progress =
                        target > 0
                            ? Math.min(
                                  Math.max(
                                      (currentSaved /
                                          target) *
                                          100,
                                      0
                                  ),
                                  100
                              )
                            : 0;

                    return {
                        id: goal.id,

                        name: goal.name,

                        targetAmount:
                            round(
                                target
                            ),

                        currentSaved:
                            round(
                                currentSaved
                            ),

                        remaining:
                            round(
                                Math.max(
                                    target -
                                        currentSaved,
                                    0
                                )
                            ),

                        progress:
                            round(
                                progress
                            ),

                        deadline:
                            goal.deadline,
                    };
                }
            );

        /* =====================================================
           PRIMARY SAVINGS GOAL
        ====================================================== */

        const primarySavingsGoal =
            savingsGoalData.length >
            0
                ? savingsGoalData[0]
                : null;

        /* =====================================================
           FINORA INSIGHT
        ====================================================== */

        const biggestExpense =
            expenseByCategory.length >
            0
                ? expenseByCategory[0]
                : null;

        let aiInsightText =
            "Add more financial data and Finora will provide personalized insights.";

        if (
            currentIncome > 0 &&
            currentExpenses >
                currentIncome
        ) {
            aiInsightText =
                "Your expenses are currently higher than your income this month. Focus on reducing non-essential spending and protecting your cash flow.";
        } else if (
            currentIncome > 0 &&
            savingsRate >= 20
        ) {
            aiInsightText =
                `You're saving ${round(
                    savingsRate
                )}% of your income this month. Keep your savings consistent and continue building your financial cushion.`;
        } else if (
            currentIncome > 0 &&
            biggestExpense
        ) {
            aiInsightText =
                `${biggestExpense.name} is currently your largest spending category this month at ₹${biggestExpense.value.toLocaleString(
                    "en-IN"
                )}. Review this category if you want to increase your savings rate.`;
        }

        /* =====================================================
           RESPONSE
        ====================================================== */

        return NextResponse.json({
            success: true,

            /* =================================================
               VOICE AI
            ================================================= */

            voiceCheckIn: {
                isNewUser,

                shouldShow:
                    shouldShowVoiceCheckIn,

                type:
                    voiceCheckInType,

                onboardingCompleted:
                    Boolean(
                        onboardingCheckIn
                    ),

                todayCompleted:
                    Boolean(
                        todayDailyCheckIn
                    ),
            },

            month: {
                year:
                    currentMonthStart.getFullYear(),

                month:
                    currentMonthStart.getMonth() +
                    1,

                label:
                    currentMonthStart.toLocaleDateString(
                        "en-IN",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    ),
            },

            summary: {
                totalBalance:
                    round(
                        totalBalance
                    ),

                income:
                    round(
                        currentIncome
                    ),

                expenses:
                    round(
                        currentExpenses
                    ),

                savings:
                    round(
                        currentSavings
                    ),

                savingsRate:
                    round(
                        savingsRate
                    ),
            },

            changes: {
                income:
                    round(
                        incomeChange
                    ),

                expenses:
                    round(
                        expenseChange
                    ),

                savings:
                    round(
                        savingsChange
                    ),
            },

            expenseByCategory,

            recentTransactions,

            budget: {
                total:
                    round(
                        totalBudget
                    ),

                spent:
                    round(
                        budgetSpent
                    ),

                remaining:
                    round(
                        budgetRemaining
                    ),

                usedPercentage:
                    round(
                        budgetUsedPercentage
                    ),

                status:
                    budgetStatus,
            },

            savingsGoal:
                primarySavingsGoal,

            savingsGoals:
                savingsGoalData,

            aiInsight: {
                text:
                    aiInsightText,

                biggestExpense:
                    biggestExpense,

                savingsRate:
                    round(
                        savingsRate
                    ),
            },
        });
    } catch (error) {
        console.error(
            "Dashboard API Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load dashboard data.",
            },
            { status: 500 }
        );
    }
}