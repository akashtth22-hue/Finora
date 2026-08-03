export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-purple-600">
        Finora
      </h1>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <a
          href="#"
          className="text-gray-700 hover:text-purple-600 transition-colors"
        >
          Features
        </a>

        <a
          href="#"
          className="text-gray-700 hover:text-purple-600 transition-colors"
        >
          About
        </a>

        <a
          href="#"
          className="text-gray-700 hover:text-purple-600 transition-colors"
        >
          Contact
        </a>

        <button className="rounded-full bg-purple-600 px-6 py-2 text-white font-medium hover:bg-purple-700 transition-colors">
          Login
        </button>
      </div>
    </nav>
  );
}