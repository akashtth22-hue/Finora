import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                image: user.image,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error(
            "Profile GET error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load profile.",
            },
            { status: 500 }
        );
    }
}

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

        const fullName =
            typeof body.fullName === "string"
                ? body.fullName.trim()
                : "";

        const phone =
            typeof body.phone === "string"
                ? body.phone.trim()
                : null;

        /*
         * Full name validation
         */
        if (!fullName) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Full name is required.",
                },
                { status: 400 }
            );
        }

        if (fullName.length < 2) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Full name must contain at least 2 characters.",
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

        /*
         * Phone validation
         *
         * Phone is optional.
         * We only allow digits, spaces,
         * +, -, (, and ).
         */
        if (
            phone &&
            !/^[0-9+\-\s()]{7,20}$/.test(
                phone
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please enter a valid phone number.",
                },
                { status: 400 }
            );
        }

        /*
         * Update only the authenticated user's
         * own record.
         */
        const updatedUser =
            await prisma.user.update({
                where: {
                    id: user.id,
                },

                data: {
                    fullName,
                    phone: phone || null,
                },
            });

        return NextResponse.json({
            success: true,

            message:
                "Profile updated successfully.",

            user: {
                id: updatedUser.id,
                fullName:
                    updatedUser.fullName,
                email:
                    updatedUser.email,
                phone:
                    updatedUser.phone,
                image:
                    updatedUser.image,
                isVerified:
                    updatedUser.isVerified,
                createdAt:
                    updatedUser.createdAt,
            },
        });
    } catch (error) {
        console.error(
            "Profile PATCH error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to update profile.",
            },
            { status: 500 }
        );
    }
}