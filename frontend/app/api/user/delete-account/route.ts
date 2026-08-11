import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const user =
            await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unauthorized.",
                },
                { status: 401 }
            );
        }

        const body =
            await request.json();

        const password =
            typeof body.password ===
            "string"
                ? body.password
                : "";

        /* ================= VALIDATION ================= */

        if (!password) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password is required to delete your account.",
                },
                { status: 400 }
            );
        }

        /* ================= VERIFY PASSWORD ================= */

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Incorrect password.",
                },
                { status: 400 }
            );
        }

        /* ================= DELETE USER ================= */

        /*
         * The Prisma schema uses
         * onDelete: Cascade, so the user's:
         *
         * - Transactions
         * - Budgets
         * - Savings Goals
         * - Savings Entries
         * - AI Usage
         * - Notifications
         *
         * are deleted automatically.
         */
        await prisma.user.delete({
            where: {
                id: user.id,
            },
        });

        /* ================= CLEAR AUTH COOKIE ================= */

        const response =
            NextResponse.json({
                success: true,
                message:
                    "Account deleted successfully.",
            });

        response.cookies.set(
            "token",
            "",
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite: "lax",

                path: "/",

                maxAge: 0,
            }
        );

        return response;
    } catch (error) {
        console.error(
            "Delete Account Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to delete your account right now.",
            },
            { status: 500 }
        );
    }
}