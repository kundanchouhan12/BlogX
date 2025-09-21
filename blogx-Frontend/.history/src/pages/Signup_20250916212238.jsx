import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(name, email, password); // local signup
    navigate("/"); // ✅ signup ke baad home pe redirect
  };

  const handleGoogleSignup = () => {
    // Dummy Google signup (baad me Firebase/Auth0 se integrate kar sakte ho)
    signup("Google User", "googleuser@gmail.com", ""); 
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Join Us 🚀
        </h2>

        {/* Local signup form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* OR divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        {/* Google signup button */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-2 w-full border py-3 rounded-lg hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} /> Sign up with Google
        </button>

        {/* Already account link */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
