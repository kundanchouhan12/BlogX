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

      // ✅ Ensure createdAt exists
      allPosts = allPosts.map(p => ({
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
        username: p.username || "Anonymous",
      }));

      // 🔹 Sort posts: latest first
      allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(allPosts);
    } catch (err) {
      console.error("fetchPosts error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create post (backend + state update)
  const createPost = async (postData) => {
    try {
      const res = await axios.post("http://localhost:8080/api/posts", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newPost = {
        ...res.data,
        createdAt: res.data.createdAt || new Date().toISOString(),
        username: res.data.username || user?.username || "Anonymous",
      };

      // 🔹 Add new post to top
      setPosts(prev => [newPost, ...prev]);

      return newPost;
    } catch (err) {
      console.error("createPost error:", err);
      throw err;
    }
  };

  // 🔹 Update post
  const updatePost = async (id, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/posts/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...res.data } : p))
      );
    } catch (err) {
      console.error("updatePost error:", err);
    }
  };

  // 🔹 Delete post
  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("deletePost error:", err);
    }
  };

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
