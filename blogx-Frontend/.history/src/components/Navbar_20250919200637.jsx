import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = ["news", "tech", "sports", "lifestyle", "travel"];

  const linkClass =
    "hover:text-indigo-600 transition px-2 py-1 rounded-md text-gray-700";

  const activeClass = "text-indigo-600 font-semibold";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-indigo-600">
          BlogX
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl text-indigo-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Home
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat}
              to={`/category/${cat}`}
              className={({ isActive }) => isActive ? activeClass : linkClass}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? activeClass : `${linkClass} text-indigo-600 font-medium`
              }
            >
              + Create Post
            </NavLink>
          )}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">
                ✨ Welcome,{" "}
                <span className="font-semibold text-indigo-600">
                  {user.name}
                </span>
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Home
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat}
              to={`/category/${cat}`}
              className={({ isActive }) => isActive ? activeClass : linkClass}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? activeClass : `${linkClass} text-indigo-600 font-medium`
              }
            >
              + Create Post
            </NavLink>
          )}
          <div className="pt-2">
            {user ? (
              <button
                onClick={logout}
                className="bg-red-500 text-white w-full px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-full px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
