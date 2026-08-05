"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(3, "Full name must be at least 3 characters"),

        email: z
            .string()
            .email("Enter a valid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z
            .string()
            .min(8, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function RegisterPage() {
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            console.log(result);

            if (!response.ok) {
                setError(result.message);
                return;
            }

            setMessage(result.message);

            setTimeout(() => {
                router.push("/login?registered=true");
            }, 2000);

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthCard
            title="Create Account"
            subtitle="Start your financial journey with Finora"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <AuthInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon="user"
                    register={register("fullName")}
                    error={errors.fullName?.message}
                />

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
                    placeholder="Create a password"
                    icon="password"
                    register={register("password")}
                    error={errors.password?.message}
                />

                <AuthInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    icon="password"
                    register={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />
                {error && (
                    <p className="rounded-lg bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="rounded-lg bg-green-100 p-3 text-sm text-green-600">
                        {message}
                    </p>
                )}

                <AuthButton>
                    {loading ? "Creating Account..." : "Create Account"}
                </AuthButton>

            </form>
            <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-purple-600 hover:text-purple-700"
                >
                    Login
                </Link>
            </p>
        </AuthCard>
    );
}