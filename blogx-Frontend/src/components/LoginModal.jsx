import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Login to Continue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <button className="flex items-center justify-center gap-2 w-full mt-4 border py-2 rounded-lg hover:bg-gray-50">
          <FcGoogle size={22} /> Login with Google
        </button>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            Cancel
          </button>
          <span>
            Don’t have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
