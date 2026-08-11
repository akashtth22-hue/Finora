import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getMonthRange(month: string) {
    if (
        typeof month !== "string" ||
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(
            month
        )
    ) {
        return null;
    }

    const [year, monthNumber] =
        month.split("-").map(Number);

    const start = new Date(
        Date.UTC(
            year,
            monthNumber - 1,
            1
        )
    );

    const end = new Date(
        Date.UTC(
            year,
            monthNumber,
            1
        )
    );

    return {
        start,
        end,
    };
}

/* ================= GET BUDGETS ================= */

export async function GET(
    req: NextRequest
) {
    try {
        const user =
            await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { searchParams } =
            new URL(req.url);

        const month =
            searchParams.get(
                "month"
            ) ||
            new Date()
                .toISOString()
                .slice(0, 7);

        const range =
            getMonthRange(month);

        if (!range) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid month format. Use YYYY-MM.",
                },
                { status: 400 }
            );
        }

        const budgets =
            await prisma.budget.findMany(
                {
                    where: {
                        userId:
                            user.id,
                        month:
                            range.start,
                    },

                    orderBy: {
                        category:
                            "asc",
                    },
                }
            );

        const transactions =
            await prisma.transaction.findMany(
                {
                    where: {
                        userId:
                            user.id,

                        type: "EXPENSE",

                        date: {
                            gte: range.start,
                            lt: range.end,
                        },
                    },
                }
            );

        const budgetsWithSpending =
            budgets.map(
                (budget) => {
                    const spent =
                        transactions
                            .filter(
                                (
                                    transaction
                                ) =>
                                    transaction.category ===
                                    budget.category
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

                    const budgetAmount =
                        Number(
                            budget.amount
                        );

                    const remaining =
                        budgetAmount -
                        spent;

                    const progress =
                        budgetAmount >
                        0
                            ? (spent /
                                  budgetAmount) *
                              100
                            : 0;

                    return {
                        ...budget,

                        spent,

                        remaining,

                        progress:
                            Math.min(
                                progress,
                                100
                            ),

                        isOverBudget:
                            spent >
                            budgetAmount,
                    };
                }
            );

        return NextResponse.json({
            success: true,
            budgets:
                budgetsWithSpending,
        });
    } catch (error) {
        console.error(
            "Get Budgets Error:",
            error
        );

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

/* ================= CREATE BUDGET ================= */

export async function POST(
    req: NextRequest
) {
    try {
        const user =
            await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body =
            await req.json();

        const {
            category,
            amount,
            month,
        } = body;

        /* ================= VALIDATION ================= */

        if (
            category ===
                undefined ||
            category === null ||
            amount ===
                undefined ||
            amount === null ||
            month ===
                undefined ||
            month === null
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Category, amount and month are required.",
                },
                { status: 400 }
            );
        }

        if (
            typeof category !==
                "string" ||
            !category.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Category is required.",
                },
                { status: 400 }
            );
        }

        const numericAmount =
            Number(amount);

        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Budget amount must be a valid number greater than zero.",
                },
                { status: 400 }
            );
        }

        const range =
            getMonthRange(month);

        if (!range) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid month format. Use YYYY-MM.",
                },
                { status: 400 }
            );
        }

        const normalizedCategory =
            category.trim();

        /* ================= DUPLICATE CHECK ================= */

        const existingBudget =
            await prisma.budget.findUnique(
                {
                    where: {
                        userId_category_month:
                            {
                                userId:
                                    user.id,

                                category:
                                    normalizedCategory,

                                month:
                                    range.start,
                            },
                    },
                }
            );

        if (existingBudget) {
            return NextResponse.json(
                {
                    success: false,
                    message: `A ${normalizedCategory} budget already exists for this month.`,
                },
                { status: 409 }
            );
        }

        /* ================= CREATE ================= */

        const budget =
            await prisma.budget.create({
                data: {
                    category:
                        normalizedCategory,

                    amount:
                        numericAmount,

                    month:
                        range.start,

                    userId:
                        user.id,
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Budget created successfully.",
            budget,
        });
    } catch (error) {
        console.error(
            "Create Budget Error:",
            error
        );

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