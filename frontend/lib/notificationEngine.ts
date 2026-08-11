import { prisma } from "@/lib/prisma";

/* =========================================================
 * GENERATE NOTIFICATIONS
 * ========================================================= */

export async function generateNotifications(
    userId: string
) {
    const now = new Date();

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    );

    /* =====================================================
     * CURRENT MONTH TRANSACTIONS
     * ===================================================== */

    const transactions =
        await prisma.transaction.findMany({
            where: {
                userId,

                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

    /* =====================================================
     * CURRENT MONTH BUDGETS
     * ===================================================== */

    const budgets =
        await prisma.budget.findMany({
            where: {
                userId,

                month: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

    /* =====================================================
     * SPENDING BY CATEGORY
     * ===================================================== */

    const spendingByCategory: Record<
        string,
        number
    > = {};

    for (const transaction of transactions) {
        if (
            transaction.type !==
            "EXPENSE"
        ) {
            continue;
        }

        const category =
            transaction.category;

        spendingByCategory[category] =
            (spendingByCategory[
                category
            ] || 0) +
            Number(
                transaction.amount
            );
    }

    /* =====================================================
     * PROCESS BUDGETS
     * ===================================================== */

    for (const budget of budgets) {
        const spent =
            spendingByCategory[
                budget.category
            ] || 0;

        const budgetAmount =
            Number(
                budget.amount
            );

        if (budgetAmount <= 0) {
            continue;
        }

        const percentage =
            (spent /
                budgetAmount) *
            100;

        /* ================= BUDGET EXCEEDED ================= */

        if (percentage >= 100) {
            await createNotificationIfNotExists(
                userId,

                "BUDGET_EXCEEDED",

                `${budget.category} budget exceeded`,

                `You've spent ₹${formatAmount(
                    spent
                )} of your ₹${formatAmount(
                    budgetAmount
                )} ${budget.category} budget.`
            );

            continue;
        }

        /* ================= BUDGET WARNING ================= */

        if (percentage >= 80) {
            await createNotificationIfNotExists(
                userId,

                "BUDGET_WARNING",

                `${budget.category} budget warning`,

                `You've used ${Math.round(
                    percentage
                )}% of your ${budget.category} budget.`
            );
        }
    }

    /* =====================================================
     * SAVINGS GOALS
     * ===================================================== */

    const savingsGoals =
        await prisma.savingsGoal.findMany({
            where: {
                userId,
            },

            include: {
                entries: true,
            },
        });

    for (const goal of savingsGoals) {
        /* ================= DEPOSITS ================= */

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

        /* ================= WITHDRAWALS ================= */

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

        if (targetAmount <= 0) {
            continue;
        }

        const progress =
            (currentSaved /
                targetAmount) *
            100;

        /* =================================================
         * SAVINGS PROGRESS
         * ================================================= */

        if (progress >= 80) {
            await createNotificationIfNotExists(
                userId,

                "SAVINGS_PROGRESS",

                `${goal.name} is almost complete`,

                `You've saved ${Math.round(
                    progress
                )}% of your ₹${formatAmount(
                    targetAmount
                )} goal.`
            );
        }

        /* =================================================
         * SAVINGS DEADLINE
         * ================================================= */

        if (goal.deadline) {
            const deadline =
                new Date(
                    goal.deadline
                );

            const difference =
                deadline.getTime() -
                now.getTime();

            const daysRemaining =
                Math.ceil(
                    difference /
                        (1000 *
                            60 *
                            60 *
                            24)
                );

            if (
                daysRemaining >= 0 &&
                daysRemaining <= 7 &&
                currentSaved <
                    targetAmount
            ) {
                await createNotificationIfNotExists(
                    userId,

                    "SAVINGS_DEADLINE",

                    `${goal.name} deadline is approaching`,

                    `Your savings goal deadline is in ${daysRemaining} day${
                        daysRemaining ===
                        1
                            ? ""
                            : "s"
                    }.`
                );
            }
        }
    }
}

/* =========================================================
 * CREATE NOTIFICATION SAFELY
 * ========================================================= */

async function createNotificationIfNotExists(
    userId: string,
    type:
        | "BUDGET_WARNING"
        | "BUDGET_EXCEEDED"
        | "SAVINGS_PROGRESS"
        | "SAVINGS_DEADLINE",
    title: string,
    message: string
) {
    const now = new Date();

    const startOfToday =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

    const endOfToday =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );

    /*
     * Check whether the same notification
     * type + title already exists today.
     *
     * We intentionally don't compare the
     * message because the amount/percentage
     * can change during the day.
     */
    const existing =
        await prisma.notification.findFirst(
            {
                where: {
                    userId,

                    type,

                    title,

                    createdAt: {
                        gte: startOfToday,
                        lt: endOfToday,
                    },
                },
            }
        );

    if (existing) {
        return;
    }

    /*
     * Prevent duplicate creation when two
     * notification requests arrive at nearly
     * the same time.
     *
     * PostgreSQL Serializable transactions
     * make the read + create operation safer.
     */
    try {
        await prisma.$transaction(
            async (tx) => {
                const alreadyExists =
                    await tx.notification.findFirst(
                        {
                            where: {
                                userId,

                                type,

                                title,

                                createdAt: {
                                    gte: startOfToday,
                                    lt: endOfToday,
                                },
                            },
                        }
                    );

                if (alreadyExists) {
                    return;
                }

                await tx.notification.create({
                    data: {
                        userId,
                        type,
                        title,
                        message,
                    },
                });
            },
            {
                isolationLevel:
                    "Serializable",
            }
        );
    } catch (error) {
        /*
         * If another request created the
         * notification simultaneously,
         * don't break the user's notification
         * endpoint.
         */
        console.error(
            "Notification creation error:",
            error
        );
    }
}

/* =========================================================
 * FORMAT MONEY
 * ========================================================= */

function formatAmount(
    amount: number
) {
    return amount.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 0,
        }
    );
}