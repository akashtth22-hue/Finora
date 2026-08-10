import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized.",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

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

        /*
         * Verify the user's current password
         */
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

        /*
         * Delete the user.
         *
         * Your Prisma schema uses onDelete: Cascade
         * for transactions, budgets and savings goals,
         * so related records are deleted automatically.
         */
        await prisma.user.delete({
            where: {
                id: user.id,
            },
        });

        /*
         * Remove authentication cookie
         */
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