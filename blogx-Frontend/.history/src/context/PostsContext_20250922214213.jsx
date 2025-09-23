import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { token, API_URL, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/posts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const allPosts = (Array.isArray(res.data) ? res.data : []).map((p) => ({
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
        username: p.username || "Anonymous",
      }));

      allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(allPosts);
    } catch (err) {
      console.error("fetchPosts error:", err.response?.data || err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create post with token
  const createPost = async (postData) => {
    if (!token) throw new Error("You must be logged in to create a post");

    try {
      const res = await axios.post(`${API_URL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newPost = {
        ...res.data,
        createdAt: res.data.createdAt || new Date().toISOString(),
        username: res.data.username || user?.name || "Anonymous",
      };

      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error("createPost error:", err.response?.data || err.message);
      throw err;
    }
  };

  const updatePost = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/api/posts/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...res.data } : p)));
    } catch (err) {
      console.error("updatePost error:", err.response?.data || err.message);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("deletePost error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  return (
    <PostsContext.Provider
      value={{ posts, loading, fetchPosts, createPost, updatePost, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
