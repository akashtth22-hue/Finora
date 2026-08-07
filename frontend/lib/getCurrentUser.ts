import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    return user;
  } catch {
    return null;
  }
}