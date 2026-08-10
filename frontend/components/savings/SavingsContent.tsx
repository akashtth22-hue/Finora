"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import AddSavingsGoalModal from "./AddSavingsGoalModal";
import SavingsEntryModal from "./SavingsEntryModal";
import EditSavingsGoalModal from "./EditSavingsGoalModal";
import DeleteSavingsGoalModal from "./DeleteSavingsGoalModal";

type SavingsEntry = {
    id: string;
    amount: number;
    type: "DEPOSIT" | "WITHDRAWAL";
    description: string | null;
    date: string;
};

type SavingsGoal = {
    id: string;
    name: string;
    targetAmount: number;
    deadline: string | null;
    totalDeposited: number;
    totalWithdrawn: number;
    currentSaved: number;
    remaining: number;
    progress: number;
    completed: boolean;
    overdue: boolean;
    entries: SavingsEntry[];
};

export default function SavingsContent() {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const [entryOpen, setEntryOpen] = useState(false);

    const [selectedGoal, setSelectedGoal] =
        useState<SavingsGoal | null>(null);

    const [editOpen, setEditOpen] =
        useState(false);

    const [deleteId, setDeleteId] =
        useState<string | null>(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    function handleAddMoney(goal: SavingsGoal) {
        setSelectedGoal(goal);
        setEntryOpen(true);
    }

    function handleEdit(goal: SavingsGoal) {
        setSelectedGoal(goal);
        setEditOpen(true);
    }

    function handleDelete(id: string) {
        setDeleteId(id);
    }

    async function confirmDelete() {
        if (!deleteId) return;

        try {
            setDeleteLoading(true);

            const response = await fetch(
                `/api/savings/${deleteId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(
                    result.message ||
                        "Failed to delete savings goal."
                );
                return;
            }

            toast.success(
                "Savings goal deleted successfully."
            );

            await queryClient.invalidateQueries({
                queryKey: ["savings"],
            });
        } catch (error) {
            console.error(error);

            toast.error(
                "Something went wrong."
            );
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    }

    const {
        data: goals = [],
        isLoading,
        isError,
        refetch,
    } = useQuery<SavingsGoal[]>({
        queryKey: ["savings"],

        queryFn: async () => {
            const response = await fetch("/api/savings", {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch savings goals"
                );
            }

            const data = await response.json();

            return data.goals;
        },
    });

    const totalSaved = goals.reduce(
        (total, goal) =>
            total + Number(goal.currentSaved),
        0
    );

    const totalTarget = goals.reduce(
        (total, goal) =>
            total + Number(goal.targetAmount),
        0
    );

    const totalRemaining = Math.max(
        totalTarget - totalSaved,
        0
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Savings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Track your goals and build your future.
                    </p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 sm:w-auto"
                >
                    + New Goal
                </button>

            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Goals
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-purple-600">
                        {goals.length}
                    </h2>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Saved
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                        ₹{totalSaved.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Remaining
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        ₹{totalRemaining.toLocaleString("en-IN")}
                    </h2>
                </div>

            </div>

            {/* Goals */}
            <div>

                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Your Savings Goals
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Keep track of the progress toward each goal.
                    </p>
                </div>

                {/* Error */}
                {isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">

                        <h3 className="text-lg font-semibold text-red-700">
                            Failed to load savings goals
                        </h3>

                        <p className="mt-2 text-sm text-red-600">
                            Something went wrong while loading your savings.
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                        >
                            Try Again
                        </button>

                    </div>

                ) : isLoading ? (

                    <div className="py-16 text-center text-gray-500">
                        Loading savings goals...
                    </div>

                ) : goals.length === 0 ? (

                    /* Empty State */
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">

                        <h3 className="text-lg font-semibold text-gray-900">
                            No savings goals yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Create your first savings goal and start
                            building toward it.
                        </p>

                        <button
                            onClick={() => setOpen(true)}
                            className="mt-6 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
                        >
                            + New Goal
                        </button>

                    </div>

                ) : (

                    /* Goal Cards */
                    <div className="space-y-4">

                        {goals.map((goal) => (
                            <div
                                key={goal.id}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >

                                {/* Goal Header */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                    <div className="min-w-0">

                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {goal.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            ₹
                                            {Number(
                                                goal.currentSaved
                                            ).toLocaleString("en-IN")}
                                            {" "}
                                            of
                                            {" "}
                                            ₹
                                            {Number(
                                                goal.targetAmount
                                            ).toLocaleString("en-IN")}
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <span
                                            className={`text-sm font-semibold ${
                                                goal.completed
                                                    ? "text-green-600"
                                                    : goal.overdue
                                                        ? "text-red-600"
                                                        : "text-purple-600"
                                            }`}
                                        >
                                            {goal.completed
                                                ? "Completed"
                                                : `${Math.round(goal.progress)}%`}
                                        </span>

                                        {/* Edit */}
                                        <button
                                            onClick={() =>
                                                handleEdit(goal)
                                            }
                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                                            title="Edit Goal"
                                        >
                                            ✏️
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() =>
                                                handleDelete(goal.id)
                                            }
                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                            title="Delete Goal"
                                        >
                                            🗑️
                                        </button>

                                    </div>

                                </div>

                                {/* Progress */}
                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">

                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            goal.completed
                                                ? "bg-green-500"
                                                : goal.overdue
                                                    ? "bg-red-500"
                                                    : "bg-purple-600"
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                goal.progress,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                                {/* Bottom Info */}
                                <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">

                                    <span
                                        className={
                                            goal.completed
                                                ? "font-medium text-green-600"
                                                : goal.overdue
                                                    ? "font-medium text-red-600"
                                                    : "text-gray-500"
                                        }
                                    >
                                        {goal.completed
                                            ? "Goal completed"
                                            : goal.overdue
                                                ? "Deadline passed"
                                                : "Remaining"}
                                    </span>

                                    {!goal.completed && (
                                        <span className="font-semibold text-gray-700">
                                            ₹
                                            {Number(
                                                goal.remaining
                                            ).toLocaleString("en-IN")}
                                        </span>
                                    )}

                                    {goal.deadline &&
                                        !goal.completed && (
                                            <span className="text-gray-400">
                                                Due{" "}
                                                {new Date(
                                                    goal.deadline
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        )}

                                </div>

                                {/* Add Money */}
                                <button
                                    onClick={() =>
                                        handleAddMoney(goal)
                                    }
                                    className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700"
                                >
                                    + Add Money
                                </button>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            {/* New Goal Modal */}
            <AddSavingsGoalModal
                open={open}
                onClose={() => setOpen(false)}
            />

            {/* Deposit / Withdrawal Modal */}
            <SavingsEntryModal
                open={entryOpen}
                goalId={selectedGoal?.id ?? null}
                goalName={selectedGoal?.name}
                currentSaved={
                    selectedGoal?.currentSaved ?? 0
                }
                onClose={() => {
                    setEntryOpen(false);
                    setSelectedGoal(null);
                }}
            />

            {/* Edit Goal Modal */}
            <EditSavingsGoalModal
                open={editOpen}
                goal={selectedGoal}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedGoal(null);
                }}
            />

            {/* Delete Goal Modal */}
            <DeleteSavingsGoalModal
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
            />

        </div>
    );
}