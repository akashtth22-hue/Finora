"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const onSubmit = async (data: any) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        const result = await response.json();

        console.log(result);
    };
    return (
        <AuthCard
            title="Welcome Back"
            subtitle="Login to continue to Finora"
        >
            {registered && (
                <p className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                    ✅ Registration successful! Please login.
                </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    icon="email"
                    register={register("email")}
                    error={errors.email?.message}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    icon="password"
                    register={register("password")}
                    error={errors.password?.message}
                />
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="text-sm font-medium text-purple-600 transition hover:text-purple-700"
                    >
                        Forgot Password?
                    </button>
                </div>

                <AuthButton>
                    Login
                </AuthButton>

            </form>
            <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="font-semibold text-purple-600 hover:text-purple-700"
                >
                    Create Account
                </Link>
            </p>
        </AuthCard>
    );
}