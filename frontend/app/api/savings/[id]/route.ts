import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
    id: string;
}>;

/* ================= UPDATE SAVINGS GOAL ================= */

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
                        "Savings goal ID is required.",
                },
                { status: 400 }
            );
        }

        /* ================= OWNERSHIP CHECK ================= */

        const existingGoal =
            await prisma.savingsGoal.findFirst(
                {
                    where: {
                        id,
                        userId: user.id,
                    },
                }
            );

        if (!existingGoal) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Savings goal not found.",
                },
                { status: 404 }
            );
        }

        /* ================= READ BODY ================= */

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

        /* ================= DEADLINE ================= */

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

        /* ================= UPDATE ================= */

        const goal =
            await prisma.savingsGoal.update({
                where: {
                    id: existingGoal.id,
                },

                data: {
                    name:
                        name.trim(),

                    targetAmount:
                        numericTargetAmount,

                    deadline:
                        deadlineDate,
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Savings goal updated successfully.",
            goal,
        });
    } catch (error) {
        console.error(
            "Update Savings Goal Error:",
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

/* ================= DELETE SAVINGS GOAL ================= */

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
                        "Savings goal ID is required.",
                },
                { status: 400 }
            );
        }

        /* ================= OWNERSHIP CHECK ================= */

        const existingGoal =
            await prisma.savingsGoal.findFirst(
                {
                    where: {
                        id,
                        userId: user.id,
                    },
                }
            );

        if (!existingGoal) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Savings goal not found.",
                },
                { status: 404 }
            );
        }

        /* ================= DELETE ================= */

        await prisma.savingsGoal.delete({
            where: {
                id: existingGoal.id,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                "Savings goal deleted successfully.",
        });
    } catch (error) {
        console.error(
            "Delete Savings Goal Error:",
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