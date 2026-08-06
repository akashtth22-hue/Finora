import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function authenticateUser(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  return {
    success: true,
    user,
  };
}