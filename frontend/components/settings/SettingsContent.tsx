"use client";

import { useQuery } from "@tanstack/react-query";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Loader2,
    RefreshCw,
    Pencil,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    LockKeyhole,
    Eye,
    EyeOff,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

type UserProfile = {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    image: string | null;
    isVerified: boolean;
    createdAt: string;
};

type ProfileResponse = {
    success: boolean;
    user: UserProfile;
};

export default function SettingsContent() {
    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery<ProfileResponse>({
        queryKey: ["user-profile"],

        queryFn: async () => {
            const response = await fetch(
                "/api/user/profile",
                {
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Failed to load profile"
                );
            }

            return result;
        },
    });

    /* ================= PROFILE STATE ================= */

    const [isEditing, setIsEditing] =
        useState(false);

    const [fullName, setFullName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [isSaving, setIsSaving] =
        useState(false);

    const [saveMessage, setSaveMessage] =
        useState("");

    const [saveError, setSaveError] =
        useState("");

    /* ================= PASSWORD STATE ================= */

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        isChangingPassword,
        setIsChangingPassword,
    ] = useState(false);

    const [
        passwordMessage,
        setPasswordMessage,
    ] = useState("");

    const [
        passwordError,
        setPasswordError,
    ] = useState("");

    /* ================= DELETE ACCOUNT STATE ================= */

    const [
        showDeleteModal,
        setShowDeleteModal,
    ] = useState(false);

    const [
        deletePassword,
        setDeletePassword,
    ] = useState("");

    const [
        showDeletePassword,
        setShowDeletePassword,
    ] = useState(false);

    const [
        isDeletingAccount,
        setIsDeletingAccount,
    ] = useState(false);

    const [
        deleteError,
        setDeleteError,
    ] = useState("");

    /* ================= SYNC PROFILE ================= */

    useEffect(() => {
        if (data?.user) {
            setFullName(
                data.user.fullName
            );

            setPhone(
                data.user.phone || ""
            );
        }
    }, [data]);

    /* ================= EDIT PROFILE ================= */

    function handleEdit() {
        if (!data?.user) return;

        setFullName(
            data.user.fullName
        );

        setPhone(
            data.user.phone || ""
        );

        setSaveMessage("");
        setSaveError("");
        setIsEditing(true);
    }

    function handleCancel() {
        if (!data?.user) return;

        setFullName(
            data.user.fullName
        );

        setPhone(
            data.user.phone || ""
        );

        setSaveMessage("");
        setSaveError("");
        setIsEditing(false);
    }

    async function handleSave() {
        const trimmedName =
            fullName.trim();

        const trimmedPhone =
            phone.trim();

        setSaveMessage("");
        setSaveError("");

        if (!trimmedName) {
            setSaveError(
                "Full name is required."
            );
            return;
        }

        if (trimmedName.length < 2) {
            setSaveError(
                "Full name must contain at least 2 characters."
            );
            return;
        }

        setIsSaving(true);

        try {
            const response =
                await fetch(
                    "/api/user/profile",
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify({
                            fullName:
                                trimmedName,

                            phone:
                                trimmedPhone,
                        }),
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Unable to update profile."
                );
            }

            setSaveMessage(
                "Profile updated successfully."
            );

            setSaveError("");
            setIsEditing(false);

            await refetch();
        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            setSaveError(
                error instanceof Error
                    ? error.message
                    : "Unable to update profile."
            );
        } finally {
            setIsSaving(false);
        }
    }

    /* ================= CHANGE PASSWORD ================= */

    function resetPasswordForm() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordMessage("");
        setPasswordError("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    }

    async function handleChangePassword() {
        setPasswordMessage("");
        setPasswordError("");

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setPasswordError(
                "Please fill in all password fields."
            );
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters long."
            );
            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setPasswordError(
                "New passwords do not match."
            );
            return;
        }

        setIsChangingPassword(true);

        try {
            const response =
                await fetch(
                    "/api/user/change-password",
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify({
                            currentPassword,
                            newPassword,
                            confirmPassword,
                        }),
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Unable to change password."
                );
            }

            setPasswordMessage(
                "Password changed successfully."
            );

            setPasswordError("");

            resetPasswordForm();
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            setPasswordError(
                error instanceof Error
                    ? error.message
                    : "Unable to change password."
            );
        } finally {
            setIsChangingPassword(false);
        }
    }

    /* ================= DELETE ACCOUNT ================= */

    function openDeleteModal() {
        setDeletePassword("");
        setDeleteError("");
        setShowDeletePassword(false);
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        if (isDeletingAccount) return;

        setShowDeleteModal(false);
        setDeletePassword("");
        setDeleteError("");
        setShowDeletePassword(false);
    }

    async function handleDeleteAccount() {
        setDeleteError("");

        if (!deletePassword) {
            setDeleteError(
                "Please enter your current password."
            );
            return;
        }

        setIsDeletingAccount(true);

        try {
            const response =
                await fetch(
                    "/api/user/delete-account",
                    {
                        method: "DELETE",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify({
                            password:
                                deletePassword,
                        }),
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Unable to delete account."
                );
            }

            window.location.href =
                "/login";
        } catch (error) {
            console.error(
                "Delete account error:",
                error
            );

            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete account."
            );
        } finally {
            setIsDeletingAccount(false);
        }
    }

    /* ================= LOADING ================= */

    if (isLoading) {
        return (
            <div className="space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your account and preferences.
                    </p>
                </div>

                <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex flex-col items-center text-center">

                        <Loader2
                            size={30}
                            className="animate-spin text-purple-600"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading your profile...
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    /* ================= ERROR ================= */

    if (isError || !data) {
        return (
            <div className="space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your account and preferences.
                    </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <User size={23} />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-red-700">
                        Unable to load your profile
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        Something went wrong while loading
                        your account information.
                    </p>

                    <button
                        onClick={() =>
                            refetch()
                        }
                        disabled={isFetching}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                isFetching
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    const user = data.user;

    const memberSince =
        new Date(
            user.createdAt
        ).toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
        );

    return (
        <>
            <div className="space-y-8">

                {/* ================= HEADER ================= */}

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your account and preferences.
                    </p>
                </div>

                {/* ================= PROFILE ================= */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <User size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Profile
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Your personal account information.
                                </p>
                            </div>

                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={
                                    handleEdit
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
                            >
                                <Pencil
                                    size={17}
                                />
                                Edit Profile
                            </button>
                        )}

                    </div>

                    {/* Success Message */}

                    {saveMessage && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                            <CheckCircle2
                                size={19}
                                className="shrink-0 text-green-600"
                            />

                            <p className="text-sm font-medium text-green-700">
                                {saveMessage}
                            </p>

                        </div>
                    )}

                    {/* Error Message */}

                    {saveError && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                            <AlertCircle
                                size={19}
                                className="shrink-0 text-red-600"
                            />

                            <p className="text-sm font-medium text-red-700">
                                {saveError}
                            </p>

                        </div>
                    )}

                    {/* Avatar */}

                    <div className="mt-8 flex items-center gap-4">

                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 text-2xl font-bold text-purple-600">

                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={
                                        user.fullName
                                    }
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                user.fullName
                                    .charAt(0)
                                    .toUpperCase()
                            )}

                        </div>

                        <div>

                            <h3 className="text-lg font-bold text-gray-900">
                                {user.fullName}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Finora member since{" "}
                                {memberSince}
                            </p>

                        </div>

                    </div>

                    {/* EDIT MODE */}

                    {isEditing ? (
                        <div className="mt-8 space-y-5">

                            {/* Full Name */}

                            <div>

                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Full Name
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="fullName"
                                        type="text"
                                        value={
                                            fullName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setFullName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        maxLength={
                                            100
                                        }
                                        disabled={
                                            isSaving
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                        placeholder="Enter your full name"
                                    />

                                </div>

                            </div>

                            {/* Email */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Email
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        value={
                                            user.email
                                        }
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500"
                                    />

                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Email changes will require
                                    verification and will be added
                                    later.
                                </p>

                            </div>

                            {/* Phone */}

                            <div>

                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Phone
                                </label>

                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(
                                            event
                                        ) =>
                                            setPhone(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        maxLength={
                                            20
                                        }
                                        disabled={
                                            isSaving
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                        placeholder="Enter your phone number"
                                    />

                                </div>

                            </div>

                            {/* Actions */}

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <X
                                        size={17}
                                    />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSave
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2
                                                size={
                                                    17
                                                }
                                                className="animate-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={
                                                    17
                                                }
                                            />
                                            Save Changes
                                        </>
                                    )}
                                </button>

                            </div>

                        </div>
                    ) : (
                        /* VIEW MODE */

                        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Full Name */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <User
                                        size={19}
                                        className="text-gray-500"
                                    />

                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {
                                                user.fullName
                                            }
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Email */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <Mail
                                        size={19}
                                        className="text-gray-500"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-xs font-medium text-gray-500">
                                            Email
                                        </p>

                                        <p className="mt-1 truncate font-semibold text-gray-900">
                                            {
                                                user.email
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Phone */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <Phone
                                        size={19}
                                        className="text-gray-500"
                                    />

                                    <div>

                                        <p className="text-xs font-medium text-gray-500">
                                            Phone
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {user.phone ||
                                                "Not added"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Verification */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <ShieldCheck
                                        size={19}
                                        className={
                                            user.isVerified
                                                ? "text-green-600"
                                                : "text-orange-500"
                                        }
                                    />

                                    <div>

                                        <p className="text-xs font-medium text-gray-500">
                                            Email Verification
                                        </p>

                                        <p
                                            className={`mt-1 font-semibold ${
                                                user.isVerified
                                                    ? "text-green-600"
                                                    : "text-orange-600"
                                            }`}
                                        >
                                            {user.isVerified
                                                ? "Verified"
                                                : "Not verified"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

                {/* ================= CHANGE PASSWORD ================= */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <LockKeyhole
                                size={22}
                            />
                        </div>

                        <div>

                            <h2 className="text-xl font-bold text-gray-900">
                                Change Password
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Keep your Finora account secure.
                            </p>

                        </div>

                    </div>

                    {/* Password Success */}

                    {passwordMessage && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                            <CheckCircle2
                                size={19}
                                className="shrink-0 text-green-600"
                            />

                            <p className="text-sm font-medium text-green-700">
                                {passwordMessage}
                            </p>

                        </div>
                    )}

                    {/* Password Error */}

                    {passwordError && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                            <AlertCircle
                                size={19}
                                className="shrink-0 text-red-600"
                            />

                            <p className="text-sm font-medium text-red-700">
                                {passwordError}
                            </p>

                        </div>
                    )}

                    <div className="mt-8 space-y-5">

                        {/* Current Password */}

                        <div>

                            <label
                                htmlFor="currentPassword"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Current Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="currentPassword"
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        currentPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCurrentPassword(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isChangingPassword
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                    placeholder="Enter current password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            (
                                                value
                                            ) =>
                                                !value
                                        )
                                    }
                                    disabled={
                                        isChangingPassword
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* New Password */}

                        <div>

                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="newPassword"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        newPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewPassword(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isChangingPassword
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                    placeholder="Enter new password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(
                                            (
                                                value
                                            ) =>
                                                !value
                                        )
                                    }
                                    disabled={
                                        isChangingPassword
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    {showNewPassword ? (
                                        <EyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>

                            </div>

                            <p className="mt-2 text-xs text-gray-400">
                                Use at least 8 characters.
                            </p>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Confirm New Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setConfirmPassword(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isChangingPassword
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                    placeholder="Confirm new password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (
                                                value
                                            ) =>
                                                !value
                                        )
                                    }
                                    disabled={
                                        isChangingPassword
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Change Password Button */}

                        <div className="flex justify-end pt-2">

                            <button
                                type="button"
                                onClick={
                                    handleChangePassword
                                }
                                disabled={
                                    isChangingPassword
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2
                                            size={
                                                17
                                            }
                                            className="animate-spin"
                                        />
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole
                                            size={
                                                17
                                            }
                                        />
                                        Change Password
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>

                {/* ================= ACCOUNT INFORMATION ================= */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="text-xl font-bold text-gray-900">
                        Account
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Basic information about your Finora account.
                    </p>

                    <div className="mt-6 rounded-xl bg-gray-50 p-4">

                        <p className="text-xs text-gray-500">
                            Account ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm text-gray-700">
                            {user.id}
                        </p>

                    </div>

                </div>

                {/* ================= DANGER ZONE ================= */}

                <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">

                    <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            <Trash2 size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Danger Zone
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Permanently delete your Finora account and
                                all associated financial data.
                            </p>
                        </div>

                    </div>

                    <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">

                        <h3 className="font-semibold text-red-700">
                            Delete your account
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-red-600">
                            This action is permanent. Your transactions,
                            budgets, savings goals and other account data
                            will be permanently deleted.
                        </p>

                        <button
                            type="button"
                            onClick={
                                openDeleteModal
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                            <Trash2 size={17} />
                            Delete Account
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= DELETE ACCOUNT MODAL ================= */}

            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeDeleteModal();
                        }
                    }}
                >

                    <div
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Modal Header */}

                        <div className="flex items-start gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                <Trash2
                                    size={22}
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Delete Account?
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    This action cannot be undone.
                                </p>
                            </div>

                        </div>

                        {/* Warning */}

                        <div className="mt-5 rounded-xl bg-red-50 p-4">

                            <p className="text-sm leading-6 text-red-700">
                                All your financial data including
                                transactions, budgets and savings
                                goals will be permanently deleted.
                            </p>

                        </div>

                        {/* Password */}

                        <div className="mt-5">

                            <label
                                htmlFor="deletePassword"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Enter your current password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="deletePassword"
                                    type={
                                        showDeletePassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        deletePassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDeletePassword(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    onKeyDown={(
                                        event
                                    ) => {
                                        if (
                                            event.key ===
                                            "Enter"
                                        ) {
                                            handleDeleteAccount();
                                        }

                                        if (
                                            event.key ===
                                            "Escape"
                                        ) {
                                            closeDeleteModal();
                                        }
                                    }}
                                    disabled={
                                        isDeletingAccount
                                    }
                                    autoFocus
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-gray-50"
                                    placeholder="Enter your password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeletePassword(
                                            (
                                                value
                                            ) =>
                                                !value
                                        )
                                    }
                                    disabled={
                                        isDeletingAccount
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                    aria-label={
                                        showDeletePassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showDeletePassword ? (
                                        <EyeOff
                                            size={
                                                18
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            size={
                                                18
                                            }
                                        />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Error */}

                        {deleteError && (
                            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                <AlertCircle
                                    size={18}
                                    className="shrink-0 text-red-600"
                                />

                                <p className="text-sm font-medium text-red-700">
                                    {deleteError}
                                </p>

                            </div>
                        )}

                        {/* Actions */}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    isDeletingAccount
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                <X size={17} />
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDeleteAccount
                                }
                                disabled={
                                    isDeletingAccount
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeletingAccount ? (
                                    <>
                                        <Loader2
                                            size={
                                                17
                                            }
                                            className="animate-spin"
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2
                                            size={
                                                17
                                            }
                                        />
                                        Delete Permanently
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}