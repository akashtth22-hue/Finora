"use client";

export default function DashboardPage() {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Dashboard Works ✅
      </h1>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}