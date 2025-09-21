import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("fetchPosts error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPosts, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
