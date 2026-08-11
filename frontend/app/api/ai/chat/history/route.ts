import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =====================================================
   GET CHAT HISTORY

   GET /api/ai/chat/history
   → Returns all conversations

   GET /api/ai/chat/history?id=xxxxx
   → Returns one conversation with all messages
===================================================== */

export async function GET(request: Request) {
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

        const url = new URL(request.url);

        const conversationId =
            url.searchParams.get("id");

        /* =================================================
           LOAD ONE CONVERSATION
        ================================================== */

        if (conversationId) {
            const conversation =
                await prisma.aIConversation.findFirst(
                    {
                        where: {
                            id: conversationId,
                            userId: user.id,
                        },

                        include: {
                            messages: {
                                orderBy: {
                                    createdAt: "asc",
                                },
                            },
                        },
                    }
                );

            if (!conversation) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Conversation not found.",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,

                conversation: {
                    id: conversation.id,
                    title:
                        conversation.title,
                    createdAt:
                        conversation.createdAt,
                    updatedAt:
                        conversation.updatedAt,

                    messages:
                        conversation.messages.map(
                            (message) => ({
                                id: message.id,

                                role:
                                    message.role ===
                                    "USER"
                                        ? "user"
                                        : "assistant",

                                content:
                                    message.content,

                                createdAt:
                                    message.createdAt,
                            })
                        ),
                },
            });
        }

        /* =================================================
           LOAD ALL CONVERSATIONS
        ================================================== */

        const conversations =
            await prisma.aIConversation.findMany({
                where: {
                    userId: user.id,
                },

                orderBy: {
                    updatedAt: "desc",
                },

                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,

                    _count: {
                        select: {
                            messages: true,
                        },
                    },
                },
            });

        return NextResponse.json({
            success: true,

            conversations:
                conversations.map(
                    (conversation) => ({
                        id: conversation.id,

                        title:
                            conversation.title ||
                            "New conversation",

                        createdAt:
                            conversation.createdAt,

                        updatedAt:
                            conversation.updatedAt,

                        messageCount:
                            conversation._count
                                .messages,
                    })
                ),
        });
    } catch (error) {
        console.error(
            "AI Chat History GET Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load chat history.",
            },
            { status: 500 }
        );
    }
}

/* =====================================================
   DELETE CHAT

   DELETE /api/ai/chat/history?id=xxxxx
===================================================== */

export async function DELETE(
    request: Request
) {
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

        const url = new URL(request.url);

        const conversationId =
            url.searchParams.get("id");

        if (!conversationId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Conversation ID is required.",
                },
                { status: 400 }
            );
        }

        /* =================================================
           SECURITY CHECK

           Only the owner of the conversation
           can delete it.
        ================================================== */

        const conversation =
            await prisma.aIConversation.findFirst(
                {
                    where: {
                        id: conversationId,
                        userId: user.id,
                    },
                }
            );

        if (!conversation) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Conversation not found.",
                },
                { status: 404 }
            );
        }

        /* =================================================
           DELETE CONVERSATION

           AIMessage records are automatically deleted
           because the Prisma relation uses:

           onDelete: Cascade
        ================================================== */

        await prisma.aIConversation.delete({
            where: {
                id: conversation.id,
            },
        });

        return NextResponse.json({
            success: true,
            message:
                "Conversation deleted successfully.",
        });
    } catch (error) {
        console.error(
            "AI Chat History DELETE Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to delete conversation.",
            },
            { status: 500 }
        );
    }
}