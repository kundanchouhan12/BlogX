// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // agar login nahi hai toh redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // login hai toh page render karo
}
