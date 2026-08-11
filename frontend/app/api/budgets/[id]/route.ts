import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
    id: string;
}>;

/* ================= UPDATE BUDGET ================= */

export async function PUT(
    req: NextRequest,
    { params }: { params: Params }
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Budget ID is required.",
                },
                { status: 400 }
            );
        }

        /* ================= FIND BUDGET ================= */

        const existingBudget =
            await prisma.budget.findFirst(
                {
                    where: {
                        id,
                        userId: user.id,
                    },
                }
            );

        /*
         * Security check:
         * The budget must belong to
         * the authenticated user.
         */
        if (!existingBudget) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Budget not found.",
                },
                { status: 404 }
            );
        }

        /* ================= READ BODY ================= */

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

        if (
            typeof month !==
                "string" ||
            !/^\d{4}-(0[1-9]|1[0-2])$/.test(
                month
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid month format. Use YYYY-MM.",
                },
                { status: 400 }
            );
        }

        const [
            year,
            monthNumber,
        ] = month
            .split("-")
            .map(Number);

        const monthDate =
            new Date(
                Date.UTC(
                    year,
                    monthNumber - 1,
                    1
                )
            );

        const normalizedCategory =
            category.trim();

        /* ================= DUPLICATE CHECK ================= */

        const duplicateBudget =
            await prisma.budget.findFirst(
                {
                    where: {
                        userId:
                            user.id,

                        category:
                            normalizedCategory,

                        month:
                            monthDate,

                        NOT: {
                            id,
                        },
                    },
                }
            );

        if (duplicateBudget) {
            return NextResponse.json(
                {
                    success: false,
                    message: `A ${normalizedCategory} budget already exists for this month.`,
                },
                { status: 409 }
            );
        }

        /* ================= UPDATE ================= */

        const budget =
            await prisma.budget.update({
                where: {
                    id: existingBudget.id,
                },

                data: {
                    category:
                        normalizedCategory,

                    amount:
                        numericAmount,

                    month:
                        monthDate,
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Budget updated successfully.",
            budget,
        });
    } catch (error) {
        console.error(
            "Update Budget Error:",
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

/* ================= DELETE BUDGET ================= */

export async function DELETE(
    req: NextRequest,
    { params }: { params: Params }
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Budget ID is required.",
                },
                { status: 400 }
            );
        }

        /* ================= OWNERSHIP CHECK ================= */

        const budget =
            await prisma.budget.findFirst(
                {
                    where: {
                        id,
                        userId: user.id,
                    },
                }
            );

        if (!budget) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Budget not found.",
                },
                { status: 404 }
            );
        }

        /* ================= DELETE ================= */

        await prisma.budget.delete({
            where: {
                id: budget.id,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                "Budget deleted successfully.",
        });
    } catch (error) {
        console.error(
            "Delete Budget Error:",
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