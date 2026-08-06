import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  console.log("🔥 Middleware Running");

  const token = req.cookies.get("token")?.value;

  console.log("Token:", token);

  if (!token) {
    console.log("❌ No Token Found");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = await verifyToken(token);

    console.log("✅ Decoded:", decoded);

    return NextResponse.next();
  } catch (error) {
    console.error("❌ JWT Error:", error);

    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};