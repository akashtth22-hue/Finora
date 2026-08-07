import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <main className="flex-1">

        <Navbar />

        <div className="p-8">
          {children}
        </div>

      </main>

    </div>
  );
}