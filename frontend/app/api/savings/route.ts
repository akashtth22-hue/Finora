import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= GET SAVINGS GOALS ================= */

export async function GET() {
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

        const goals =
            await prisma.savingsGoal.findMany(
                {
                    where: {
                        userId: user.id,
                    },

                    include: {
                        entries: {
                            orderBy: {
                                date: "desc",
                            },
                        },
                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                }
            );

        const goalsWithStats =
            goals.map((goal) => {
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

                const targetAmount =
                    Number(
                        goal.targetAmount
                    );

                const remaining =
                    targetAmount -
                    currentSaved;

                const progress =
                    targetAmount > 0
                        ? (currentSaved /
                              targetAmount) *
                          100
                        : 0;

                const completed =
                    currentSaved >=
                    targetAmount;

                const overdue =
                    !completed &&
                    goal.deadline !==
                        null &&
                    new Date(
                        goal.deadline
                    ) <
                        new Date();

                return {
                    id: goal.id,
                    name: goal.name,
                    targetAmount,
                    deadline:
                        goal.deadline,
                    createdAt:
                        goal.createdAt,

                    totalDeposited,
                    totalWithdrawn,
                    currentSaved,

                    remaining:
                        Math.max(
                            remaining,
                            0
                        ),

                    progress:
                        Math.min(
                            Math.max(
                                progress,
                                0
                            ),
                            100
                        ),

                    completed,
                    overdue,

                    entries:
                        goal.entries,
                };
            });

        return NextResponse.json({
            success: true,
            goals:
                goalsWithStats,
        });
    } catch (error) {
        console.error(
            "Get Savings Goals Error:",
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

/* ================= CREATE SAVINGS GOAL ================= */

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
            name,
            targetAmount,
            deadline,
        } = body;

        /* ================= VALIDATION ================= */

        if (
            name === undefined ||
            name === null ||
            targetAmount ===
                undefined ||
            targetAmount === null
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Goal name and target amount are required.",
                },
                { status: 400 }
            );
        }

        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Goal name is required.",
                },
                { status: 400 }
            );
        }

        const numericTargetAmount =
            Number(targetAmount);

        if (
            !Number.isFinite(
                numericTargetAmount
            ) ||
            numericTargetAmount <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Target amount must be a valid number greater than zero.",
                },
                { status: 400 }
            );
        }

        let deadlineDate:
            | Date
            | null = null;

        if (
            deadline !==
                undefined &&
            deadline !== null &&
            deadline !== ""
        ) {
            if (
                typeof deadline !==
                "string"
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Invalid deadline.",
                    },
                    { status: 400 }
                );
            }

            const parsedDeadline =
                new Date(deadline);

            if (
                Number.isNaN(
                    parsedDeadline.getTime()
                )
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Invalid deadline.",
                    },
                    { status: 400 }
                );
            }

            deadlineDate =
                parsedDeadline;
        }

        /* ================= CREATE ================= */

        const goal =
            await prisma.savingsGoal.create({
                data: {
                    name:
                        name.trim(),

                    targetAmount:
                        numericTargetAmount,

                    deadline:
                        deadlineDate,

                    userId:
                        user.id,
                },
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Savings goal created successfully.",
                goal,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Create Savings Goal Error:",
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