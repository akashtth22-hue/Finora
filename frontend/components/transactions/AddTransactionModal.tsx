"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AddTransactionModal({
    open,
    onClose,
}: Props) {

    const [amount, setAmount] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (!amount || !category || !date) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/transactions", {
                method: "POST",
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
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert("Transaction Added Successfully!");

            setAmount("");
            setCategory("");
            setDescription("");
            setDate("");
            setType("EXPENSE");

            onClose();

            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
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
                            Add Transaction
                        </h2>

                        <p className="text-gray-500">
                            Record your income or expense.
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

                    <input
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border p-3"
                    />

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
                        {loading ? "Saving..." : "Save Transaction"}
                    </button>

                </div>

            </div>

        </div>
    );
}