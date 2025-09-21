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

      // ✅ Add username + trending
      allPosts = allPosts
        .map((p) => ({
          ...p,
          username: p.username || "Anonymous",
          trending: false,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first

      // Mark first 3 latest as trending
      allPosts.slice(0, 3).forEach((p) => (p.trending = true));

      setPosts(allPosts);
    } catch (err) {
      console.error("fetchPosts error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add new post (create post)
  const addPost = (newPost) => {
    const withUser = {
      ...newPost,
      username: newPost.username || user?.username || "Anonymous",
      trending: true, // new post is trending by default
    };
    setPosts((prev) => [withUser, ...prev]);
  };

  // 🔹 Update existing post
  const updatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p))
    );
  };

  // 🔹 Delete post
  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // 🔹 Auto-fetch posts on token change
  useEffect(() => {
    fetchPosts();
  }, [token]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        addPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
