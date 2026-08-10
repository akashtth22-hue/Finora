"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string | null;
};

type Props = {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
};

export default function EditSavingsGoalModal({
  open,
  goal,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !goal) return;

    setName(goal.name);
    setTargetAmount(String(goal.targetAmount));

    setDeadline(
      goal.deadline
        ? new Date(goal.deadline)
            .toISOString()
            .split("T")[0]
        : ""
    );
  }, [open, goal]);

  async function handleUpdate() {
    if (!goal) return;

    if (!name.trim() || !targetAmount) {
      toast.error(
        "Goal name and target amount are required."
      );
      return;
    }

    const numericTargetAmount =
      Number(targetAmount);

    if (
      !Number.isFinite(numericTargetAmount) ||
      numericTargetAmount <= 0
    ) {
      toast.error(
        "Please enter a valid target amount."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/savings/${goal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            targetAmount: numericTargetAmount,
            deadline: deadline || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Failed to update savings goal."
        );
        return;
      }

      toast.success(
        "Savings goal updated successfully."
      );

      await queryClient.invalidateQueries({
        queryKey: ["savings"],
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

        <div className="mb-8 flex items-start justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Savings Goal
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your savings target.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Goal Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Target Amount
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="1"
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(e.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 p-3 pl-9 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
              />

            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deadline
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Update Goal"}
          </button>

        </div>

      </div>
    </div>
  );
}