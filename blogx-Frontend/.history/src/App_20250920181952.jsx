import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import PrivateRoute from "./components/PrivateRoute";
import BlogDetails from "./pages/BlogDetails";
import UpdatePost from "./components/UpdatePost";

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

          {/* Create Post */}
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          {/* Optional alias redirect: /create → /create-post */}
          <Route path="/create" element={<Navigate to="/create-post" />} />

          {/* Update Post */}
          <Route
            path="/update-post/:id"
            element={
              <PrivateRoute>
                <UpdatePost />
              </PrivateRoute>
            }
          />

          {/* Blog Details */}
          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <BlogDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
