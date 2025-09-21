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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // image preview
    } else {
      setImage(null);
      setPreview(null);
    }
  };

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
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8080/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      addPost(res.data);

      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
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
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
        Create a New Post
      </h2>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.includes("successfully") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Content
          </label>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-64 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-40 object-cover rounded-lg"
            />
          )}
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
