import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
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

        const body = await request.json();

        const currentPassword =
            typeof body.currentPassword === "string"
                ? body.currentPassword
                : "";

        const newPassword =
            typeof body.newPassword === "string"
                ? body.newPassword
                : "";

        const confirmPassword =
            typeof body.confirmPassword === "string"
                ? body.confirmPassword
                : "";

        /* ================= VALIDATION ================= */

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All password fields are required.",
                },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password must be at least 8 characters long.",
                },
                { status: 400 }
            );
        }

        if (newPassword.length > 128) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password is too long.",
                },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New passwords do not match.",
                },
                { status: 400 }
            );
        }

        /* ================= CURRENT PASSWORD ================= */

        const isCurrentPasswordValid =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Current password is incorrect.",
                },
                { status: 400 }
            );
        }

        /* ================= SAME PASSWORD ================= */

        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );

        if (isSamePassword) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password must be different from your current password.",
                },
                { status: 400 }
            );
        }

        /* ================= HASH ================= */

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                12
            );

        /* ================= UPDATE ================= */

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                "Password changed successfully.",
        });
    } catch (error) {
        console.error(
            "Change Password Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to change password right now.",
            },
            { status: 500 }
        );
    }
}