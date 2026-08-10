import { prisma } from "@/lib/prisma";

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

    /*
     * Get current month's transactions
     */
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

    /*
     * Get current month's budgets
     */
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

    /*
     * Calculate spending by category
     */
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

        spendingByCategory[
            transaction.category
        ] =
            (spendingByCategory[
                transaction.category
            ] || 0) +
            Number(transaction.amount);
    }

    /*
     * Process budgets
     */
    for (const budget of budgets) {
        const spent =
            spendingByCategory[
                budget.category
            ] || 0;

        const budgetAmount =
            Number(budget.amount);

        if (budgetAmount <= 0) {
            continue;
        }

        const percentage =
            (spent / budgetAmount) * 100;

        /*
         * Budget exceeded
         */
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

        /*
         * Budget warning
         */
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

    /*
     * Savings goals
     */
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
        const deposited =
            goal.entries
                .filter(
                    (entry) =>
                        entry.type ===
                        "DEPOSIT"
                )
                .reduce(
                    (total, entry) =>
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
                    (total, entry) =>
                        total +
                        Number(
                            entry.amount
                        ),
                    0
                );

        const currentSaved =
            deposited - withdrawn;

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

        /*
         * Savings progress
         */
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

        /*
         * Savings deadline
         */
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
                        daysRemaining === 1
                            ? ""
                            : "s"
                    }.`
                );
            }
        }
    }
}

/*
 * Prevent duplicate notifications.
 */
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
    const existing =
        await prisma.notification.findFirst(
            {
                where: {
                    userId,
                    type,
                    title,
                    message,
                    createdAt: {
                        gte: new Date(
                            new Date().setHours(
                                0,
                                0,
                                0,
                                0
                            )
                        ),
                    },
                },
            }
        );

    if (existing) {
        return;
    }

    await prisma.notification.create({
        data: {
            userId,
            type,
            title,
            message,
        },
    });
}

/*
 * Format money consistently.
 */
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