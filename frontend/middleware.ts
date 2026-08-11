import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(
    req: NextRequest
) {
    const token =
        req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    try {
        await verifyToken(token);

        return NextResponse.next();
    } catch {
        const response =
            NextResponse.redirect(
                new URL("/login", req.url)
            );

        /*
         * Remove an invalid/expired token
         * so the browser doesn't keep sending it.
         */
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
    }
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/transactions/:path*",
        "/budget/:path*",
        "/savings/:path*",
        "/analytics/:path*",
        "/ai/:path*",
        "/settings/:path*",
    ],
};