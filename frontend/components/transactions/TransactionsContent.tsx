"use client";
type Transaction = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string | null;
    date: string;
};

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import TransactionSummary from "./TransactionSummary";
import TransactionToolbar from "./TransactionToolbar";
import TransactionList from "./TransactionList";
import AddTransactionModal from "./AddTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

export default function TransactionsContent() {

    const {
        data: transactions = [],
        isLoading,
        isError,
        refetch,
    } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await fetch("/api/transactions", {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data = await response.json();

            return data.transactions;
        },
    });

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [type, setType] = useState("All");
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };
    function handleDelete(id: string) {
        setDeleteId(id);
    }

    async function confirmDelete() {
        if (!deleteId) return;

        setDeleteLoading(true);

        try {
            const response = await fetch(
                `/api/transactions?id=${deleteId}`,
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

            await refetch();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    }
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.category
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            (transaction.description ?? "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" ||
            transaction.category === category;

        const matchesType =
            type === "All" ||
            transaction.type === type;

        return matchesSearch && matchesCategory && matchesType;
    });


    return (
    <>
        <div className="space-y-8">

            {/* Page Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Transactions
                        </h1>

                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                            {transactions.length}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Track, manage and understand where your money goes.
                    </p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-md active:scale-[0.98]"
                >
                    <span className="mr-2 text-lg leading-none">+</span>
                    Add Transaction
                </button>
            </div>

            {/* Summary */}
            <TransactionSummary
                transactions={transactions}
            />

            {/* Filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <TransactionToolbar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    type={type}
                    setType={setType}
                />
            </div>

            {/* Content */}
            <div className="min-h-[200px]">

                {isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
                        <h3 className="text-lg font-semibold text-red-700">
                            Failed to load transactions
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-red-600">
                            Something went wrong while loading your transactions.
                        </p>

                        <button
                            onClick={() => refetch()}
                            className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>

                ) : isLoading && filteredTransactions.length === 0 ? (

                    <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />

                        <p className="text-sm font-medium text-gray-600">
                            Loading transactions...
                        </p>
                    </div>

                ) : filteredTransactions.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                            💳
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-gray-900">
                            {transactions.length === 0
                                ? "No transactions yet"
                                : "No matching transactions"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            {transactions.length === 0
                                ? "Start tracking your money by adding your first transaction."
                                : "Try changing your search or filters to find what you're looking for."}
                        </p>

                        {transactions.length === 0 && (
                            <button
                                onClick={() => setOpen(true)}
                                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow-md active:scale-[0.98]"
                            >
                                + Add Transaction
                            </button>
                        )}
                    </div>

                ) : (

                    <TransactionList
                        transactions={filteredTransactions}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />

                )}

            </div>
        </div>

        <DeleteTransactionModal
            open={deleteId !== null}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            loading={deleteLoading}
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