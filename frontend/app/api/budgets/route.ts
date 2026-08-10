import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getMonthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  if (
    !year ||
    !monthNumber ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return null;
  }

  const start = new Date(
    Date.UTC(year, monthNumber - 1, 1)
  );

  const end = new Date(
    Date.UTC(year, monthNumber, 1)
  );

  return { start, end };
}

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);

    const month =
      searchParams.get("month") ||
      new Date().toISOString().slice(0, 7);

    const range = getMonthRange(month);

    if (!range) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid month format.",
        },
        { status: 400 }
      );
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
        month: range.start,
      },
      orderBy: {
        category: "asc",
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: range.start,
          lt: range.end,
        },
      },
    });

    const budgetsWithSpending = budgets.map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.category === budget.category
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount),
          0
        );

      const remaining = Number(budget.amount) - spent;

      const progress =
        budget.amount > 0
          ? (spent / Number(budget.amount)) * 100
          : 0;

      return {
        ...budget,
        spent,
        remaining,
        progress: Math.min(progress, 100),
        isOverBudget: spent > Number(budget.amount),
      };
    });

    return NextResponse.json({
      success: true,
      budgets: budgetsWithSpending,
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

    const range = getMonthRange(month);

    if (!range) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid month format.",
        },
        { status: 400 }
      );
    }

    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_category_month: {
          userId: user.id,
          category,
          month: range.start,
        },
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        {
          success: false,
          message: `A ${category} budget already exists for this month.`,
        },
        { status: 409 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        category,
        amount: numericAmount,
        month: range.start,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Budget created successfully.",
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