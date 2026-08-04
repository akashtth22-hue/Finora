export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-xl font-bold text-white">
            F
          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Finora
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-gray-600 transition hover:text-purple-600">
            Features
          </a>

          <a href="#" className="text-gray-600 transition hover:text-purple-600">
            About
          </a>

          <a href="#" className="text-gray-600 transition hover:text-purple-600">
            Contact
          </a>

          <button className="rounded-xl bg-purple-600 px-6 py-2.5 font-medium text-white transition hover:bg-purple-700">
            Login →
          </button>
        </div>
      </div>
    </nav>
  );
}