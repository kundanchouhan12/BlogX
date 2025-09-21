import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import axios from "axios";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("You must be logged in to create a post!");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setMessage("Title and content required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/posts",
        {
          userId: user.id,
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || null,
          category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newPost = {
        ...res.data,
        trending: true,
        isNew: true,
      };
      addPost(newPost);

      setTitle("");
      setContent("");
      setImageUrl("");
      setCategory("General");
      setMessage("Post created successfully!");

      navigate("/");
    } catch (err) {
      console.error("Create post error:", err.response?.data || err.message);
      setMessage("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Create a New Post</h2>

      {message && (
        <p className={`mb-4 text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-64 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (optional)</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {["General", "Tech", "Travel", "Lifestyle", "Sports", "Adventure"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full font-semibold text-white transition ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
