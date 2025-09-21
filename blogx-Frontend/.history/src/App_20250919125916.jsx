// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import PrivateRoute from "./components/PrivateRoute";
import BlogDetails from "./pages/BlogDetails";
import EditPost from "./pages/EditPost";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar har page par show hoga */}
      <Navbar />

      {/* Routes */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route path="/posts/:id" element={<BlogDetails />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </div>
  );
}
