export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row">
        
        {/* Logo */}
        <h2 className="text-2xl font-bold text-purple-600">
          Finora
        </h2>

        {/* Links */}
        <div className="flex gap-6 text-gray-600">
          <a href="#" className="hover:text-purple-600">
            Features
          </a>

          <a href="#" className="hover:text-purple-600">
            About
          </a>

          <a href="#" className="hover:text-purple-600">
            Contact
          </a>
        </div>

      </div>

      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © 2026 Finora. All rights reserved.
      </div>
    </footer>
  );
}