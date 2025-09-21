import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { token } = useAuth();
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/posts",
        { title, content, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addPost(res.data); // context me turant add
      navigate("/");     // home page
    } catch (err) {
      console.error("Create post error:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-full">
        Create Post
      </button>
    </form>
  );
}
