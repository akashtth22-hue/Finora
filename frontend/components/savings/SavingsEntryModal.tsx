"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  goalId: string | null;
  goalName?: string;
  currentSaved?: number;
  onClose: () => void;
};

export default function SavingsEntryModal({
  open,
  goalId,
  goalName,
  currentSaved = 0,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [type, setType] = useState<
    "DEPOSIT" | "WITHDRAWAL"
  >("DEPOSIT");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setType("DEPOSIT");
      setAmount("");
      setDescription("");
      setDate(
        new Date().toISOString().slice(0, 10)
      );
    }
  }, [open]);

  async function handleSave() {
    if (!goalId) {
      toast.error("Savings goal not found.");
      return;
    }

    if (!amount || !date) {
      toast.error(
        "Please fill all required fields."
      );
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      toast.error(
        "Please enter a valid amount."
      );
      return;
    }

    if (
      type === "WITHDRAWAL" &&
      numericAmount > currentSaved
    ) {
      toast.error(
        "Withdrawal cannot be greater than your current savings."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/savings/${goalId}/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            amount: numericAmount,
            type,
            description:
              description.trim() || null,
            date,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Failed to save savings entry."
        );
        return;
      }

      toast.success(
        type === "DEPOSIT"
          ? "Money added successfully."
          : "Money withdrawn successfully."
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
              Add Savings Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {goalName
                ? `Update your "${goalName}" goal.`
                : "Record a savings activity."}
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

        {/* Type */}
        <div className="mb-6 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() => setType("DEPOSIT")}
            disabled={loading}
            className={`rounded-xl border px-4 py-3 font-medium transition ${
              type === "DEPOSIT"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            + Deposit
          </button>

          <button
            type="button"
            onClick={() =>
              setType("WITHDRAWAL")
            }
            disabled={loading}
            className={`rounded-xl border px-4 py-3 font-medium transition ${
              type === "WITHDRAWAL"
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            − Withdraw
          </button>

        </div>

        {/* Current Balance */}
        <div className="mb-6 rounded-2xl bg-gray-50 p-4">

          <p className="text-sm text-gray-500">
            Current Saved
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            ₹
            {Number(
              currentSaved
            ).toLocaleString("en-IN")}
          </p>

        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="1"
                placeholder="5000"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 p-3 pl-9 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
              />

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
              <span className="ml-2 text-xs font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              type="text"
              placeholder={
                type === "DEPOSIT"
                  ? "Monthly savings"
                  : "Emergency withdrawal"
              }
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
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
            className={`rounded-xl px-5 py-3 font-medium text-white transition disabled:opacity-50 ${
              type === "DEPOSIT"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Saving..."
              : type === "DEPOSIT"
                ? "Add Money"
                : "Withdraw Money"}
          </button>

        </div>

      </div>
    </div>
  );
}