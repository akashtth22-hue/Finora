export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50">

      {/* Background Blur */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-300 opacity-30 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-300 opacity-30 blur-3xl"></div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        {children}
      </div>

    </main>
  );
}