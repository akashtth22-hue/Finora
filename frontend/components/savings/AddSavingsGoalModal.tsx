"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddSavingsGoalModal({
  open,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setTargetAmount("");
      setDeadline("");
    }
  }, [open]);

  async function handleSave() {
    if (!name.trim() || !targetAmount) {
      toast.error(
        "Goal name and target amount are required."
      );
      return;
    }

    const numericTargetAmount = Number(targetAmount);

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

      const response = await fetch("/api/savings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          targetAmount: numericTargetAmount,
          deadline: deadline || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Failed to create savings goal."
        );
        return;
      }

      toast.success(
        "Savings goal created successfully."
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              New Savings Goal
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Set a target and start building toward it.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Goal Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Goal Name
            </label>

            <input
              type="text"
              placeholder="e.g. New Laptop"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          {/* Target */}
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
                placeholder="80000"
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(e.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 p-3 pl-9 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deadline
              <span className="ml-2 text-xs font-normal text-gray-400">
                Optional
              </span>
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

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Create Goal"}
          </button>

        </div>

      </div>
    </div>
  );
}