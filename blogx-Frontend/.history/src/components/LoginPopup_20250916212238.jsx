import { useAuth } from "../context/AuthContext";

export default function LoginPopup({ onClose }) {
  const { login } = useAuth();

  const handleLogin = () => {
    const dummyUser = { name: "Guest User" }; // temporary user
    login(dummyUser);
    onClose(); // popup band ho jaye
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center w-80">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          🚀 Please login to continue
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleLogin}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
