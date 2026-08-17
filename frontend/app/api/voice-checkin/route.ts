import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type VoiceCheckInType = "ONBOARDING" | "DAILY";

function getIndiaDayStart(date = new Date()) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const parts = formatter.formatToParts(date);

    const year = Number(
        parts.find((part) => part.type === "year")?.value
    );

    const month = Number(
        parts.find((part) => part.type === "month")?.value
    );

    const day = Number(
        parts.find((part) => part.type === "day")?.value
    );

    return new Date(
        Date.UTC(
            year,
            month - 1,
            day,
            0,
            0,
            0,
            0
        ) - 5.5 * 60 * 60 * 1000
    );
}

export async function POST(request: Request) {
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

        const type = body?.type as VoiceCheckInType;
        const answers = body?.answers;

        if (
            type !== "ONBOARDING" &&
            type !== "DAILY"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid voice check-in type.",
                },
                { status: 400 }
            );
        }

        if (
            !answers ||
            typeof answers !== "object" ||
            Array.isArray(answers)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Voice check-in answers are required.",
                },
                { status: 400 }
            );
        }

        const checkInDate =
            getIndiaDayStart();

        const existing =
            await prisma.voiceCheckIn.findFirst({
                where: {
                    userId: user.id,
                    type,
                    checkInDate,
                    status: "COMPLETED",
                },
            });

        if (existing) {
            return NextResponse.json({
                success: true,
                alreadyCompleted: true,
                checkInId: existing.id,
            });
        }

        const checkIn =
            await prisma.voiceCheckIn.create({
                data: {
                    userId: user.id,
                    type,
                    status: "COMPLETED",
                    checkInDate,
                    answers,
                    completedAt: new Date(),
                },
            });

        return NextResponse.json({
            success: true,
            alreadyCompleted: false,
            checkInId: checkIn.id,
        });
    } catch (error) {
        console.error(
            "Voice check-in API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to save voice check-in.",
            },
            { status: 500 }
        );
    }
}