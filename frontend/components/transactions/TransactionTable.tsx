"use client";

type Transaction = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string | null;
    date: string;
};

type TransactionTableProps = {
    transactions: Transaction[];
};

export default function TransactionTable({
    transactions,
}: TransactionTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Category</th>
                        <th className="px-6 py-4 text-left">Type</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Description</th>
                    </tr>

                </thead>

                <tbody>

                    {transactions.map((transaction) => (
                        <tr
                            key={transaction.id}
                            className="border-t"
                        >
                            <td className="px-6 py-4">
                                {new Date(transaction.date).toISOString().split("T")[0]}
                            </td>
                            <td className="px-6 py-4">
                                {transaction.category}
                            </td>

                            <td
                                className={`px-6 py-4 font-semibold ${transaction.type === "INCOME"
                                    ? "text-green-600"
                                    : "text-red-500"
                                    }`}
                            >
                                {transaction.type}
                            </td>

                            <td className="px-6 py-4 font-bold">
                                ₹{transaction.amount}
                            </td>

                            <td className="px-6 py-4">
                                {transaction.description}
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}