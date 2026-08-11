import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
    id: string;
}>;

export async function PUT(
    req: NextRequest,
    { params }: { params: Params }
) {
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

        const { id } = await params;

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

        /* ================= FIND TRANSACTION ================= */

        const existingTransaction =
            await prisma.transaction.findFirst({
                where: {
                    id,
                    userId: user.id,
                },
            });

        /*
         * Important security check:
         * the transaction must belong to
         * the authenticated user.
         */
        if (!existingTransaction) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Transaction not found.",
                },
                { status: 404 }
            );
        }

        /* ================= READ BODY ================= */

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

        /* ================= UPDATE ================= */

        const transaction =
            await prisma.transaction.update({
                where: {
                    id: existingTransaction.id,
                },

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
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Transaction updated successfully.",
            transaction,
        });
    } catch (error) {
        console.error(
            "Update Transaction Error:",
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