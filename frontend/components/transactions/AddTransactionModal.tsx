"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
    transaction?: {
        id: string;
        amount: number;
        type: string;
        category: string;
        description: string | null;
        date: string;
    } | null;
};

export default function AddTransactionModal({
    open,
    onClose,
    transaction,
}: Props) {

    const [amount, setAmount] = useState(
        transaction?.amount?.toString() || ""
    );

    const [type, setType] = useState(
        transaction?.type || "EXPENSE"
    );

    const [category, setCategory] = useState(
        transaction?.category || ""
    );

    const [description, setDescription] = useState(
        transaction?.description || ""
    );

    const [date, setDate] = useState(
        transaction?.date?.split("T")[0] || ""
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount.toString());
            setType(transaction.type);
            setCategory(transaction.category);
            setDescription(transaction.description || "");
            setDate(transaction.date.split("T")[0]);
        } else {
            setAmount("");
            setType("EXPENSE");
            setCategory("");
            setDescription("");
            setDate("");
        }
    }, [transaction, open]);

    async function handleSave() {
        if (!amount || !category || !date) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                transaction
                    ? `/api/transactions/${transaction.id}`
                    : "/api/transactions",
                {
                    method: transaction ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: Number(amount),
                        type,
                        category,
                        description,
                        date,
                        userId: "cmsfypha80001umfwi8n51n44",
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            toast.success(
                transaction
                    ? "Transaction updated successfully."
                    : "Transaction added successfully."
            );

            setAmount("");
            setCategory("");
            setDescription("");
            setDate("");
            setType("EXPENSE");

            onClose();

            window.location.reload();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h2 className="text-2xl font-bold">
                            {transaction ? "Edit Transaction" : "Add Transaction"}
                        </h2>

                        <p className="text-gray-500">
                            {transaction
                                ? "Update your transaction."
                                : "Record your income or expense."}
                        </p>
                    </div>

                    <button onClick={onClose}>
                        <X />
                    </button>

                </div>

                <div className="space-y-5">

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Transport">Transport</option>
                        <option value="Salary">Salary</option>
                        <option value="Bills">Bills</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Entertainment">Entertainment</option>
                    </select>

                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

                </div>

                <div className="mt-8 flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="rounded-xl border px-5 py-3"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-xl bg-purple-600 px-5 py-3 text-white disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : transaction
                                ? "Update Transaction"
                                : "Save Transaction"}
                    </button>

                </div>

            </div>

        </div>
    );
}