"use client";

import { useState } from "react";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
} from "lucide-react";

type AuthInputProps = {
    label: string;
    type?: string;
    placeholder: string;
    register?: any;
    error?: string;
    icon?: "user" | "email" | "password";
};

export default function AuthInput({
    label,
    type = "text",
    placeholder,
    register,
    error,
    icon,
}: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const Icon =
        icon === "user"
            ? User
            : icon === "email"
                ? Mail
                : icon === "password"
                    ? Lock
                    : null;

    return (
        <div className="mb-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                )}
                <input
                    {...register}
                    type={isPassword && showPassword ? "text" : type}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-2.5 pr-12 text-gray-900 placeholder:text-gray-400 caret-purple-600 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                />
                {error && (
                    <p className="mt-2 text-sm text-red-500">
                        {error}
                    </p>
                )}

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
}