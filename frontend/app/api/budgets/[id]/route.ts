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
      category,
      amount,
      month,
    } = body;

    if (!category || !amount || !month) {
      return NextResponse.json(
        {
          success: false,
          message: "Category, amount and month are required.",
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Budget amount must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const [year, monthNumber] = month
      .split("-")
      .map(Number);

    if (
      !year ||
      !monthNumber ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid month format.",
        },
        { status: 400 }
      );
    }

    const monthDate = new Date(
      Date.UTC(year, monthNumber - 1, 1)
    );

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingBudget) {
      return NextResponse.json(
        {
          success: false,
          message: "Budget not found.",
        },
        { status: 404 }
      );
    }

    const duplicateBudget =
      await prisma.budget.findFirst({
        where: {
          userId: user.id,
          category,
          month: monthDate,
          NOT: {
            id,
          },
        },
      });

    if (duplicateBudget) {
      return NextResponse.json(
        {
          success: false,
          message: `A ${category} budget already exists for this month.`,
        },
        { status: 409 }
      );
    }

    const budget = await prisma.budget.update({
      where: {
        id,
      },
      data: {
        category,
        amount: numericAmount,
        month: monthDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Budget updated successfully.",
      budget,
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

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!budget) {
      return NextResponse.json(
        {
          success: false,
          message: "Budget not found.",
        },
        { status: 404 }
      );
    }

    await prisma.budget.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Budget deleted successfully.",
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