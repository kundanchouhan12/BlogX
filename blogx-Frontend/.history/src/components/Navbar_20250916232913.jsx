import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          BlogX
        </Link>

        {/* Links */}
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>

          {/* Categories as simple links */}
          <Link to="/category/news" className="hover:text-indigo-600">
            News
          </Link>
          <Link to="/category/tech" className="hover:text-indigo-600">
            Tech
          </Link>
          <Link to="/category/sports" className="hover:text-indigo-600">
            Sports
          </Link>
          <Link to="/category/lifestyle" className="hover:text-indigo-600">
            Lifestyle
          </Link>
          <Link to="/category/travel" className="hover:text-indigo-600">
            Travel
          </Link>

          {/* Create Post visible only if logged in */}
          {user && (
            <Link to="/create" className="hover:text-indigo-600 font-medium">
              + Create Post
            </Link>
          )}
        </div>

        {/* Auth Section */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden md:block">
              ✨ Welcome,{" "}
              <span className="font-semibold text-indigo-600">
                {user.name}
              </span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
