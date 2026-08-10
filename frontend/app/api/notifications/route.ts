import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { generateNotifications } from "@/lib/notificationEngine";
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

        /*
         * Generate fresh notifications
         * from the user's financial data.
         */
        await generateNotifications(
            user.id
        );

        const notifications =
            await prisma.notification.findMany({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 20,
            });

        return NextResponse.json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error(
            "Notifications GET Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load notifications.",
            },
            { status: 500 }
        );
    }
}