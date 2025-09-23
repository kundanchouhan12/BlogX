import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import axios from "axios";
import { useState, useEffect } from "react";

export default function EditPost() {
  const { id } = useParams();
  const { token, API_URL } = useAuth(); // ✅ added API_URL
  const { posts, fetchPosts } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const post = posts.find((p) => p.id.toString() === id);
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.imageUrl || "");
    }
  }, [id, posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/posts/${id}`, // ✅ updated URL
        { title, content, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPosts();
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-4 py-2 h-64"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
