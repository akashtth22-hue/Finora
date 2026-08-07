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
    const { id } = await params;

    const body = await req.json();

    const {
      amount,
      type,
      category,
      description,
      date,
    } = body;

    if (!amount || !type || !category || !date) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are mandatory.",
        },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        amount,
        type,
        category,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transaction updated successfully.",
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