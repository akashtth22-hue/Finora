import TransactionsContent from "@/components/transactions/TransactionsContent";

async function getTransactions() {
  const res = await fetch(
    "http://localhost:3000/api/transactions?userId=cmsfypha80001umfwi8n51n44",
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return data.transactions;
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <TransactionsContent
      transactions={transactions}
    />
  );
}