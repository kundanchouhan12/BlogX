import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { token, user } = useAuth(); // 👈 user bhi extract kiya
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchPosts error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 👇 addPost me username inject kar rahe hain
  const addPost = (newPost) => {
    const withUser = {
      ...newPost,
      username: user?.username || "Anonymous", // default fallback
    };
    setPosts((prev) => [withUser, ...prev]); // Home aur recent me turant reflect hoga
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  return (
    <PostsContext.Provider value={{ posts, loading, fetchPosts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
