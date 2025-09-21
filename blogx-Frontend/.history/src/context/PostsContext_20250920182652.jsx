import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch posts from backend
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      let allPosts = Array.isArray(res.data) ? res.data : [];

      // normalize + sort (latest first)
      allPosts = allPosts
        .map((p) => ({
          ...p,
          username: p.username || "Anonymous",
          trending: false,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // mark first 3 as trending
      allPosts.slice(0, 3).forEach((p) => (p.trending = true));

      setPosts(allPosts);
    } catch (err) {
      console.error("fetchPosts error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create post in backend + update state
  const createPost = async (formData) => {
    try {
      const res = await axios.post("http://localhost:8080/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newPost = {
        ...res.data,
        username: res.data.username || user?.username || "Anonymous",
        trending: true,
      };

      // add new post at top
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error("createPost error:", err);
      throw err;
    }
  };

  // 🔹 Update existing post
  const updatePost = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/posts/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...res.data } : p))
      );
    } catch (err) {
      console.error("updatePost error:", err);
    }
  };

  // 🔹 Delete post
  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("deletePost error:", err);
    }
  };

  // auto-fetch whenever token changes
  useEffect(() => {
    fetchPosts();
  }, [token]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
