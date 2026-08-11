import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

        const body = await req.json();

        const {
            amount,
            type,
            category,
            description,
            date,
        } = body;

        /* ================= VALIDATION ================= */

        if (
            amount === undefined ||
            amount === null ||
            type === undefined ||
            category === undefined ||
            date === undefined
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All required fields are mandatory.",
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
                        "Amount must be a valid number greater than 0.",
                },
                { status: 400 }
            );
        }

        if (
            type !== "INCOME" &&
            type !== "EXPENSE"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid transaction type.",
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

        const transactionDate =
            new Date(date);

        if (
            Number.isNaN(
                transactionDate.getTime()
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid transaction date.",
                },
                { status: 400 }
            );
        }

        /* ================= CREATE ================= */

        const transaction =
            await prisma.transaction.create({
                data: {
                    amount:
                        numericAmount,

                    type,

                    category:
                        category.trim(),

                    description:
                        typeof description ===
                        "string"
                            ? description.trim()
                            : null,

                    date:
                        transactionDate,

                    userId: user.id,
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Transaction added successfully.",
            transaction,
        });
    } catch (error) {
        console.error(
            "Create Transaction Error:",
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

/* ================= GET TRANSACTIONS ================= */

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

        const transactions =
            await prisma.transaction.findMany(
                {
                    where: {
                        userId: user.id,
                    },

                    orderBy: {
                        date: "desc",
                    },
                }
            );

        return NextResponse.json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error(
            "Get Transactions Error:",
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

/* ================= DELETE TRANSACTION ================= */

export async function DELETE(
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

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Transaction ID is required.",
                },
                { status: 400 }
            );
        }

        /*
         * Verify that this transaction
         * belongs to the authenticated user.
         */
        const transaction =
            await prisma.transaction.findFirst(
                {
                    where: {
                        id,
                        userId: user.id,
                    },
                }
            );

        if (!transaction) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Transaction not found.",
                },
                { status: 404 }
            );
        }

        await prisma.transaction.delete({
            where: {
                id: transaction.id,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                "Transaction deleted successfully.",
        });
    } catch (error) {
        console.error(
            "Delete Transaction Error:",
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