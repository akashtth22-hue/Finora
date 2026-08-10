import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

        const transactions =
            await prisma.transaction.findMany({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    date: "asc",
                },
            });

        const incomeTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.type === "INCOME"
            );

        const expenseTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            );

        const totalIncome =
            incomeTransactions.reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

        const totalExpenses =
            expenseTransactions.reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

        const netCashFlow =
            totalIncome - totalExpenses;

        const savingsRate =
            totalIncome > 0
                ? (netCashFlow / totalIncome) * 100
                : 0;

        /*
         * Expense breakdown by category
         */
        const categoryMap: Record<
            string,
            number
        > = {};

        expenseTransactions.forEach(
            (transaction) => {
                const category =
                    transaction.category;

                categoryMap[category] =
                    (categoryMap[category] || 0) +
                    Number(transaction.amount);
            }
        );

        const categoryBreakdown = Object.entries(
            categoryMap
        )
            .map(([category, amount]) => ({
                category,
                amount,
                percentage:
                    totalExpenses > 0
                        ? (amount /
                              totalExpenses) *
                          100
                        : 0,
            }))
            .sort(
                (a, b) =>
                    b.amount - a.amount
            );

        /*
         * Monthly income / expense data
         */
        const monthlyMap: Record<
            string,
            {
                income: number;
                expenses: number;
            }
        > = {};

        transactions.forEach(
            (transaction) => {
                const date =
                    new Date(transaction.date);

                const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;

                if (!monthlyMap[monthKey]) {
                    monthlyMap[monthKey] = {
                        income: 0,
                        expenses: 0,
                    };
                }

                if (
                    transaction.type ===
                    "INCOME"
                ) {
                    monthlyMap[
                        monthKey
                    ].income += Number(
                        transaction.amount
                    );
                } else {
                    monthlyMap[
                        monthKey
                    ].expenses += Number(
                        transaction.amount
                    );
                }
            }
        );

        const monthlyData = Object.entries(
            monthlyMap
        )
            .map(
                ([
                    month,
                    values,
                ]) => ({
                    month,
                    income: values.income,
                    expenses:
                        values.expenses,
                    net:
                        values.income -
                        values.expenses,
                })
            )
            .sort((a, b) =>
                a.month.localeCompare(
                    b.month
                )
            );

        /*
         * Top spending categories
         */
        const topCategories =
            categoryBreakdown.slice(0, 5);

        return NextResponse.json({
            success: true,

            summary: {
                totalIncome,
                totalExpenses,
                netCashFlow,
                savingsRate,
            },

            categoryBreakdown,

            topCategories,

            monthlyData,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal Server Error",
            },
            { status: 500 }
        );
    }
}