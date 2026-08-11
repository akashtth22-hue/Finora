import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
    id: string;
}>;

export async function POST(
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
                        "Savings goal ID is required.",
                },
                { status: 400 }
            );
        }

        /*
         * IMPORTANT SECURITY CHECK
         *
         * The savings goal must belong
         * to the authenticated user.
         */
        const goal =
            await prisma.savingsGoal.findFirst(
                {
                    where: {
                        id,
                        userId: user.id,
                    },
                    include: {
                        entries: true,
                    },
                }
            );

        if (!goal) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Savings goal not found.",
                },
                { status: 404 }
            );
        }

        const body =
            await req.json();

        const {
            amount,
            type,
            description,
            date,
        } = body;

        /* ================= VALIDATION ================= */

        if (
            amount === undefined ||
            amount === null ||
            type === undefined ||
            type === null ||
            date === undefined ||
            date === null
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Amount, type and date are required.",
                },
                { status: 400 }
            );
        }

        if (
            type !== "DEPOSIT" &&
            type !== "WITHDRAWAL"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid savings entry type.",
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
                        "Amount must be a valid number greater than zero.",
                },
                { status: 400 }
            );
        }

        const entryDate =
            new Date(date);

        if (
            Number.isNaN(
                entryDate.getTime()
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid date.",
                },
                { status: 400 }
            );
        }

        /* ================= CURRENT SAVINGS ================= */

        const totalDeposited =
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

        const totalWithdrawn =
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
            totalDeposited -
            totalWithdrawn;

        /* ================= WITHDRAWAL CHECK ================= */

        if (
            type === "WITHDRAWAL" &&
            numericAmount >
                currentSaved
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Withdrawal cannot be greater than your current savings.",
                },
                { status: 400 }
            );
        }

        /* ================= DESCRIPTION ================= */

        let cleanedDescription:
            | string
            | null = null;

        if (
            typeof description ===
            "string"
        ) {
            const trimmed =
                description.trim();

            if (trimmed) {
                cleanedDescription =
                    trimmed;
            }
        }

        /* ================= CREATE ENTRY ================= */

        const entry =
            await prisma.savingsEntry.create(
                {
                    data: {
                        amount:
                            numericAmount,

                        type,

                        description:
                            cleanedDescription,

                        date:
                            entryDate,

                        goalId:
                            goal.id,
                    },
                }
            );

        return NextResponse.json(
            {
                success: true,

                message:
                    type === "DEPOSIT"
                        ? "Money added to savings successfully."
                        : "Money withdrawn from savings successfully.",

                entry,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Savings Entry Error:",
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