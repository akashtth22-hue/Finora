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
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          amount={transaction.amount}
          category={transaction.category}
          type={transaction.type}
          description={transaction.description}
          date={new Date(transaction.date).toISOString().split("T")[0]}
        />
      ))}
    </div>
  );
}