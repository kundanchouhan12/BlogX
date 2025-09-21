// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth(); // ✅ AuthContext ka login use karo
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await response.json();

      // ✅ AuthContext ka login call karo
      login({ id: data.id, name: data.name }, data.token);

      // ✅ Navigate to home ya post page
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Email or Username"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full mb-3"
        >
          Login
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-500 font-semibold cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}
