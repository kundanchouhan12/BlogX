import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // ✅ Safe localStorage parse
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken || null;
  });

  const [showPopup, setShowPopup] = useState(true);

  const login = (userData, jwtToken) => {
    // userData ab { id, name } hoga
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);

    setShowPopup(false);
    navigate("/"); // login ke baad home
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowPopup(false);
    navigate("/"); // logout ke baad home
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, showPopup, setShowPopup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);