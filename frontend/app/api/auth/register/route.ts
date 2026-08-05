import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    return NextResponse.json({
        message: "GET API is working!",
    });
}

export async function POST(req: NextRequest) {
    const { fullName, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return NextResponse.json(
            {
                success: false,
                message: "Email already exists",
            },
            { status: 400 }
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json({
        success: true,
        message: "User registered successfully!",
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        },
    });
}