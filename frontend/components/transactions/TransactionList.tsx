import TransactionCard from "./TransactionCard";

type Transaction = {
    id: string;
    amount: number;
    type: string;
    category: string;
    description: string | null;
    date: string;

};

export default function TransactionList({
    transactions,
    onDelete,
    onEdit,
    search,
    category,
    type,
}: {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
    search: string;
    category: string;
    type: string;
}) {
    return (
        <div className="space-y-4">
            {transactions
                .filter((transaction) => {
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
                })
                .map((transaction) => (
                    <TransactionCard
                        key={transaction.id}
                        id={transaction.id}
                        amount={transaction.amount}
                        category={transaction.category}
                        type={transaction.type}
                        description={transaction.description}
                        date={new Date(transaction.date).toISOString().split("T")[0]}
                        onDelete={onDelete}
                        onEdit={() => onEdit(transaction)}
                    />
                ))}
        </div>
    );
}