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

      let allPosts = Array.isArray(res.data) ? res.data : [];

      // ✅ Normalize posts -> add username + trending by default
      allPosts = allPosts.map((p, index) => ({
        ...p,
        username: p.username || "Anonymous",
        trending: index < 3, // first 3 latest posts ko trending banao
      }));

      setPosts(allPosts);
    } catch (err) {
      console.error("fetchPosts error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ addPost function
  const addPost = async (newPost) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/posts",
        {
          ...newPost,
          username: user?.username || "Anonymous", // 👈 username inject
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // ✅ Add newly created post to state
      setPosts((prev) => [
        {
          ...res.data,
          username: res.data.username || user?.username || "Anonymous",
        },
        ...prev,
      ]);

      return res.data;
    } catch (err) {
      console.error("addPost error:", err);
      throw err;
    }
  };

  return (
    <PostsContext.Provider value={{ posts, loading, fetchPosts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
