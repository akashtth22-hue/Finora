import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      amount,
      type,
      category,
      description,
      date,
      userId,
    } = body;

    if (
      !amount ||
      !type ||
      !category ||
      !date ||
      !userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are mandatory.",
        },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        description,
        date: new Date(date),
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transaction added successfully.",
      transaction,
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
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      transactions,
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
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction ID is required.",
        },
        { status: 400 }
      );
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully.",
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