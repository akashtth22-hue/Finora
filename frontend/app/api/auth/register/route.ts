import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const fullName =
            typeof body.fullName === "string"
                ? body.fullName.trim()
                : "";

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        /* ================= VALIDATION ================= */

        if (!fullName || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Full name, email and password are required.",
                },
                { status: 400 }
            );
        }

        if (fullName.length < 2) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please enter a valid full name.",
                },
                { status: 400 }
            );
        }

        if (fullName.length > 100) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Full name is too long.",
                },
                { status: 400 }
            );
        }

        /* ================= EMAIL ================= */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please enter a valid email address.",
                },
                { status: 400 }
            );
        }

        /* ================= PASSWORD ================= */

        if (password.length < 8) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must be at least 8 characters long.",
                },
                { status: 400 }
            );
        }

        if (password.length > 128) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password is too long.",
                },
                { status: 400 }
            );
        }

        /* ================= EXISTING USER ================= */

        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email,
                },
            });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "An account with this email already exists.",
                },
                { status: 409 }
            );
        }

        /* ================= HASH PASSWORD ================= */

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        /* ================= CREATE USER ================= */

        const user =
            await prisma.user.create({
                data: {
                    fullName,
                    email,
                    password:
                        hashedPassword,
                },
            });

        /* ================= RESPONSE ================= */

        return NextResponse.json(
            {
                success: true,
                message:
                    "User registered successfully!",
                user: {
                    id: user.id,
                    fullName:
                        user.fullName,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Registration Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to create your account right now.",
            },
            { status: 500 }
        );
    }
}