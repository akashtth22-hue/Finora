import { SignJWT, jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error(
        "JWT_SECRET is not configured."
    );
}

const secret = new TextEncoder().encode(
    jwtSecret
);

export async function generateToken(
    userId: string,
    email: string
) {
    return await new SignJWT({
        userId,
        email,
    })
        .setProtectedHeader({
            alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyToken(
    token: string
) {
    const { payload } =
        await jwtVerify(
            token,
            secret
        );

    return payload;
}