"use client";

import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function DeleteBudgetModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle size={22} />
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* Content */}
        <div className="mt-6">

          <h2 className="text-xl font-bold text-gray-900">
            Delete Budget?
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            This budget will be permanently deleted.
            This action cannot be undone.
          </p>

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
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>
    </div>
  );
}