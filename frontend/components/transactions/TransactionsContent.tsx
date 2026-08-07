"use client";

import { useState } from "react";
import { toast } from "sonner";

import TransactionSummary from "./TransactionSummary";
import TransactionToolbar from "./TransactionToolbar";
import TransactionList from "./TransactionList";
import AddTransactionModal from "./AddTransactionModal";

type Transaction = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string | null;
    date: string;
};

export default function TransactionsContent({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [type, setType] = useState("All");
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

    const handleEdit = (transaction: any) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };
    async function handleDelete(id: string) {
        const confirmDelete = confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `/api/transactions?id=${id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message);
                return;
            }

            toast.success("Transaction deleted successfully.");

            window.location.reload();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Transactions
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage all your income and expenses.
                    </p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="rounded-xl bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
                >
                    + Add Transaction
                </button>
            </div>

            <div className="mb-8">
                <TransactionSummary />
            </div>

            <TransactionToolbar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                type={type}
                setType={setType}
            />

            <TransactionList
                transactions={transactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
                search={search}
                category={category}
                type={type}
            />


            <AddTransactionModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
            />
        </>
    );
}