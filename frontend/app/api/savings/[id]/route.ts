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

    const body = await req.json();

    const {
      name,
      targetAmount,
      deadline,
    } = body;

    if (!name || !targetAmount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Goal name and target amount are required.",
        },
        { status: 400 }
      );
    }

    const numericTargetAmount =
      Number(targetAmount);

    if (
      !Number.isFinite(numericTargetAmount) ||
      numericTargetAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Target amount must be greater than zero.",
        },
        { status: 400 }
      );
    }

    let deadlineDate: Date | null = null;

    if (deadline) {
      const parsedDeadline = new Date(deadline);

      if (Number.isNaN(parsedDeadline.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid deadline.",
          },
          { status: 400 }
        );
      }

      deadlineDate = parsedDeadline;
    }

    const existingGoal =
      await prisma.savingsGoal.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!existingGoal) {
      return NextResponse.json(
        {
          success: false,
          message: "Savings goal not found.",
        },
        { status: 404 }
      );
    }

    const goal =
      await prisma.savingsGoal.update({
        where: {
          id,
        },
        data: {
          name: name.trim(),
          targetAmount: numericTargetAmount,
          deadline: deadlineDate,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Savings goal updated successfully.",
      goal,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const existingGoal =
      await prisma.savingsGoal.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!existingGoal) {
      return NextResponse.json(
        {
          success: false,
          message: "Savings goal not found.",
        },
        { status: 404 }
      );
    }

    await prisma.savingsGoal.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Savings goal deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}