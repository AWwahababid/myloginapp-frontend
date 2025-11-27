import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
    setMenuOpen(false);
    // Navigate after clearing storage
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  };

  if (!token) return null; // hide navbar if not logged in

  return (
    <nav className="bg-slate-800 bg-opacity-60 backdrop-blur-xl border-b border-slate-700 border-opacity-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="font-bold text-lg sm:text-xl bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            My Login
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 lg:space-x-6 items-center">
            {!isAdmin && (
              <>
                <Link to="/profile" className="hover:text-purple-400 transition">Profile</Link>
                <Link to="/tasks" className="hover:text-purple-400 transition">Tasks</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="hover:text-purple-400 transition">Admin</Link>
            )}
            <button
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAdmin && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                  Profile
                </Link>
                <Link
                  to="/tasks"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                  Tasks
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition text-left"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
