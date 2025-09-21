import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { user, token } = useAuth();
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isValidUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setMessage("You must be logged in to create a post!"); return; }
    if (!title.trim() || !content.trim()) { setMessage("Title and content required."); return; }
    if (imageUrl.trim() && !isValidUrl(imageUrl.trim())) { setMessage("Invalid image URL."); return; }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/posts",
        { userId: user.id, title: title.trim(), content: content.trim(), imageUrl: imageUrl.trim() || null, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addPost(res.data);
      setMessage("Post created successfully!");
      setTitle(""); setContent(""); setImageUrl(""); setCategory("General");
      navigate(`/posts/${res.data.id}`);
    } catch (err) {
      console.error("Create post error:", err.response?.data || err.message);
      setMessage("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border rounded px-4 py-2" />
        <textarea placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} className="w-full border rounded px-4 py-2 h-64" />
        <input type="text" placeholder="Image URL (optional)" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} className="w-full border rounded px-4 py-2" />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border rounded px-4 py-2">
          {["General","Tech","Travel","Lifestyle","Sports","Adventure"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-full">
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
