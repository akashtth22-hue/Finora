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
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          id={transaction.id}
          amount={transaction.amount}
          category={transaction.category}
          type={transaction.type}
          description={transaction.description}
          date={new Date(transaction.date)
            .toISOString()
            .split("T")[0]}
          onDelete={onDelete}
          onEdit={() => onEdit(transaction)}
        />
      ))}
    </div>
  );
}